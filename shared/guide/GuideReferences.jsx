import React, { useRef, useState } from 'react';

/*
 * Glanceable reference blocks for a guide step. Each answers "what do I need right now?" visually:
 *   sequence  – ordered tokens: 2 → 3 → 1 → 4
 *   image     – a code chart / diagram, tap to open full-screen on a phone
 *   facts     – short label → value pairs (Wind → Odin)
 *   chips     – unordered locations / items
 *   list      – a very short numbered checklist
 *   warning   – the one thing that breaks the step
 *   tabs      – one block per variant (e.g. per staff), each with its own blocks
 *   custom    – a map-specific interactive tool: { type: 'custom', render: () => <Tool /> }
 */

function SequenceRef({ label, items, note }) {
  return (
    <div className="gref gref--sequence">
      {label && <span className="gref__label">{label}</span>}
      <ol className="gref-sequence" aria-label={label ?? 'Sequence'}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            <span>{item}</span>
          </li>
        ))}
      </ol>
      {note && <p className="gref__note">{note}</p>}
    </div>
  );
}

function ImageRef({ src, alt, caption, width, height }) {
  const dialogRef = useRef(null);
  const open = () => dialogRef.current?.showModal?.();
  const close = () => dialogRef.current?.close?.();

  return (
    <figure className="gref gref--image">
      <button type="button" className="gref-image__open" onClick={open} aria-label={`Enlarge: ${alt}`}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        <span className="gref-image__zoom" aria-hidden="true">⤢</span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
      <dialog ref={dialogRef} className="gref-lightbox" onClick={close} aria-label={alt}>
        <img src={src} alt={alt} />
        <button type="button" className="gref-lightbox__close" onClick={close}>Close</button>
      </dialog>
    </figure>
  );
}

function FactsRef({ label, items }) {
  return (
    <div className="gref gref--facts">
      {label && <span className="gref__label">{label}</span>}
      <dl className="gref-facts">
        {items.map((item) => (
          <div key={item.k} style={item.tone ? { '--gref-tone': item.tone } : undefined}>
            <dt>{item.k}</dt>
            <dd>{item.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ChipsRef({ label, items }) {
  return (
    <div className="gref gref--chips">
      {label && <span className="gref__label">{label}</span>}
      <ul className="gref-chips">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function ListRef({ label, items }) {
  return (
    <div className="gref gref--list">
      {label && <span className="gref__label">{label}</span>}
      <ol className="gref-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ol>
    </div>
  );
}

function WarningRef({ text }) {
  return (
    <p className="gref gref--warning" role="note">
      <strong>Watch out</strong> {text}
    </p>
  );
}

function TabsRef({ label, tabs, activeTab, onTab }) {
  const [localTab, setLocalTab] = useState(tabs[0]?.id);
  const selected = activeTab ?? localTab;
  const tab = tabs.find((item) => item.id === selected) ?? tabs[0];
  const choose = (id) => (onTab ? onTab(id) : setLocalTab(id));

  return (
    <div className="gref gref--tabs">
      <div className="gref-tabs" role="tablist" aria-label={label ?? 'Variants'}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === tab.id}
            className="gref-tabs__tab"
            style={item.tone ? { '--gref-tone': item.tone } : undefined}
            onClick={() => choose(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="gref-tabs__panel" role="tabpanel" style={tab.tone ? { '--gref-tone': tab.tone } : undefined}>
        <GuideReferences refs={tab.refs} />
      </div>
    </div>
  );
}

const RENDERERS = {
  sequence: SequenceRef,
  image: ImageRef,
  facts: FactsRef,
  chips: ChipsRef,
  list: ListRef,
  warning: WarningRef,
  tabs: TabsRef,
};

export default function GuideReferences({ refs = [], tabState }) {
  return (
    <div className="gref-stack">
      {refs.map((ref, index) => {
        const key = ref.key ?? `${ref.type}-${index}`;
        if (ref.type === 'custom') return <div className="gref gref--custom" key={key}>{ref.render()}</div>;
        const Renderer = RENDERERS[ref.type];
        if (!Renderer) return null;
        const extra = ref.type === 'tabs' && tabState ? { activeTab: tabState.value, onTab: tabState.set } : {};
        return <Renderer key={key} {...ref} {...extra} />;
      })}
    </div>
  );
}

