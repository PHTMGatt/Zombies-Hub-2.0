import React from 'react';

/*
 * The parts every tab page is built from, so staffs, upgrades, locations and step details read as one system:
 * a page head, an optional video-and-choices workspace, big tappable choices, and screenshot cards with captions.
 */

// Page head: which main-guide step this tab serves, the page title, one readable intro line.
export function SysPageHead({ step, title, intro }) {
  return (
    <header className="sys-page-head">
      {step && <p className="sys-page-head__step">{step}</p>}
      <h2 className="sys-page-head__title">{title}</h2>
      {intro && <p className="sys-page-head__intro">{intro}</p>}
    </header>
  );
}

// Video on one side (it stays in view on desktop), the choices on the other. Stacked on phones.
export function SysWorkspace({ video, children }) {
  return (
    <div className="sys-work">
      <div className="sys-work__video">{video}</div>
      <div className="sys-work__side">{children}</div>
    </div>
  );
}

// A labelled block inside a page (a list of choices, a group of screenshots).
export function SysBlock({ id, title, count, note, children }) {
  return (
    <section className="sys-block" id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="sys-block__head">
        <h3 className="sys-block__title" id={id ? `${id}-title` : undefined}>{title}</h3>
        {count != null && <span className="sys-block__count">{count}</span>}
      </div>
      {note && <p className="sys-block__note">{note}</p>}
      {children}
    </section>
  );
}

// Big tappable choices (map areas, regions). One is always current.
export function SysPicker({ label, options, current, onPick }) {
  return (
    <div className="sys-picker" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.key === current;
        return (
          <button
            key={option.key}
            type="button"
            className={`sys-chip${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onPick(option.key)}
          >
            <span className="sys-chip__label">{option.label}</span>
            {option.detail && <span className="sys-chip__detail">{option.detail}</span>}
          </button>
        );
      })}
    </div>
  );
}

// Numbered, timestamped rows that jump the guide video.
export function SysOptionList({ label, options, activeKey, onSelect }) {
  return (
    <ol className="sys-options" aria-label={label}>
      {options.map((option, index) => {
        const active = option.key === activeKey;
        return (
          <li key={option.key}>
            <button
              type="button"
              className={`sys-option${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onSelect(option)}
            >
              <span className="sys-option__num" aria-hidden="true">{index + 1}</span>
              <span className="sys-option__title">{option.title}</span>
              {option.meta && <span className="sys-option__time">{option.meta}</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// Screenshot cards: one card per spot, every picture at 16:9 with a caption you can read.
// groups: [{ id, label, images: [{ src, alt, caption, width, height }] }]
export function SysShots({ id, title, intro, groups }) {
  return (
    <section className="sys-shots" id={id} aria-labelledby={`${id}-title`}>
      <h3 className="sys-shots__title" id={`${id}-title`}>{title}</h3>
      {intro && <p className="sys-shots__intro">{intro}</p>}
      <div className={`sys-shots__grid${groups.every((g) => g.images.length > 1) ? ' sys-shots__grid--pairs' : ''}`}>
        {groups.map((group, i) => (
          <article className="sys-shot" key={group.id}>
            {group.label && (
              <h4 className="sys-shot__label">
                <span className="sys-shot__num" aria-hidden="true">{i + 1}</span>
                {group.label}
              </h4>
            )}
            <div className="sys-shot__images">
              {group.images.map((img) => (
                <figure className="sys-shot__fig" key={img.src}>
                  <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
                  <figcaption>{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
