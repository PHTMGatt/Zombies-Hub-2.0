import React, { useId, useRef, useState } from 'react';
import './guide.css';

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
      {/* Lazy and sized like the thumbnail: the closed lightbox's copy waits until it opens. */}
      <dialog ref={dialogRef} className="gref-lightbox" onClick={close} aria-label={alt}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
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

// Arrow keys walk the tabs (wrapping), Home / End jump to the ends; the tab under focus is selected.
const TAB_MOVES = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

// Tabs: one panel at a time, WAI-ARIA tabs pattern. Collapsible (Origins compact guide): each button
// opens or closes its own reference, so they are disclosure buttons rather than tabs.
function TabsRef({ label, tabs, activeTab, onTab, collapsible = false }) {
  const [localTab, setLocalTab] = useState(collapsible ? null : tabs[0]?.id);
  const base = useId();
  const listRef = useRef(null);
  const selected = onTab ? activeTab : localTab;
  const tab = tabs.find((item) => item.id === selected) ?? (collapsible ? null : tabs[0]);
  const choose = (id) => {
    const next = collapsible && selected === id ? null : id;
    return onTab ? onTab(next) : setLocalTab(next);
  };
  const tabId = (item) => `${base}-tab-${item.id}`;
  const panelId = `${base}-panel`;

  // One tab stop for the row (the selected tab), as the tabs pattern expects.
  const onKey = (event) => {
    if (collapsible) return;
    const index = tabs.indexOf(tab);
    const target = event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
        : TAB_MOVES[event.key] ? (index + TAB_MOVES[event.key] + tabs.length) % tabs.length : null;
    if (target === null) return;
    event.preventDefault();
    choose(tabs[target].id);
    listRef.current?.querySelectorAll('[role="tab"]')[target]?.focus();
  };

  return (
    <div className="gref gref--tabs">
      <div className="gref-tabs" role={collapsible ? 'group' : 'tablist'} aria-label={label ?? 'Variants'} ref={listRef} onKeyDown={onKey}>
        {tabs.map((item) => (
          <button
            key={item.id}
            id={tabId(item)}
            type="button"
            {...(collapsible
              ? { 'aria-expanded': item.id === tab?.id, 'aria-controls': item.id === tab?.id ? panelId : undefined }
              : { role: 'tab', 'aria-selected': item.id === tab?.id, 'aria-controls': panelId, tabIndex: item.id === tab?.id ? 0 : -1 })}
            className="gref-tabs__tab"
            style={item.tone ? { '--gref-tone': item.tone } : undefined}
            onClick={() => choose(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab && (
        <div
          className="gref-tabs__panel"
          id={panelId}
          {...(collapsible ? { role: 'region', 'aria-label': `${tab.label} reference` } : { role: 'tabpanel', 'aria-labelledby': tabId(tab) })}
          style={tab.tone ? { '--gref-tone': tab.tone } : undefined}
        >
          <GuideReferences refs={tab.refs} />
        </div>
      )}
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

export default function GuideReferences({ refs = [], tabState, collapsibleTabs = false }) {
  return (
    <div className="gref-stack">
      {refs.map((ref, index) => {
        const key = ref.key ?? `${ref.type}-${index}`;
        if (ref.type === 'custom') return <div className="gref gref--custom" key={key}>{ref.render()}</div>;
        const Renderer = RENDERERS[ref.type];
        if (!Renderer) return null;
        const extra = ref.type === 'tabs' ? { ...(tabState ? { activeTab: tabState.value, onTab: tabState.set } : {}), collapsible: collapsibleTabs } : {};
        return <Renderer key={key} {...ref} {...extra} />;
      })}
    </div>
  );
}

