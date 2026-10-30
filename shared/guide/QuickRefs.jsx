import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GuideReferences from './GuideReferences';

/*
 * The map's most-used references, one tap from the toolbar: staff codes, the valve solver, part spots…
 * Opening one shows that step's reference blocks (and its checklist as a plain list) in a sheet, so the
 * player can look something up without moving their place in the run.
 * items: [{ label, stepId }] for an in-guide reference, or [{ label, to }] for a reference page.
 */
export default function QuickRefs({ items: allItems, steps, label }) {
  // A reference pointing at a step that no longer exists is dropped (and flagged while developing).
  const items = allItems.filter((item) => {
    const ok = item.to || steps.some((entry) => entry.id === item.stepId);
    if (!ok && import.meta.env?.DEV) console.warn(`QuickRefs: no step "${item.stepId}" for "${item.label}"`);
    return ok;
  });
  const dialogRef = useRef(null);
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState(null);
  const active = items.find((item) => item.stepId === openId);
  const step = active ? steps.find((entry) => entry.id === active.stepId) : null;

  const open = () => {
    setOpenId(null);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  // Unmount the open reference when the sheet closes (by button, backdrop or Esc), so its tools never
  // linger as hidden duplicates of the ones in the step.
  const onClose = () => setOpenId(null);

  return (
    <>
      <button type="button" className="guide-quickrefs" onClick={open} aria-haspopup="dialog">
        Quick refs
      </button>
      <dialog
        ref={dialogRef}
        className="guide-sheet"
        aria-label={`${label} quick references`}
        onClose={onClose}
        onClick={(event) => event.target === dialogRef.current && close()}
      >
        <div className="guide-sheet__inner">
          <header className="guide-sheet__head">
            {step ? (
              <button type="button" className="guide-sheet__back" onClick={() => setOpenId(null)}>← All references</button>
            ) : (
              <strong>Quick refs</strong>
            )}
            <button type="button" className="guide-sheet__close" onClick={close} aria-label="Close quick references">×</button>
          </header>

          {step ? (
            <section className="guide-sheet__body" aria-label={active.label}>
              <h3>{active.label}</h3>
              <GuideReferences refs={step.refs} tabState={{ value: tab, set: setTab }} />
              {step.tasks?.length > 0 && (
                <ul className="guide-sheet__list">
                  {step.tasks.map((task) => (
                    <li key={task.id} style={task.tone ? { '--gref-tone': task.tone } : undefined}>
                      <strong>{task.label}</strong>
                      {task.hint && <span>{task.hint}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : (
            <ul className="guide-sheet__menu">
              {items.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} onClick={close}>{item.label} <span aria-hidden="true">↗</span></Link>
                  ) : (
                    <button type="button" onClick={() => { setTab(null); setOpenId(item.stepId); }}>{item.label} <span aria-hidden="true">→</span></button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
