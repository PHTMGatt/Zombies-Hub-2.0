import React, { useRef } from 'react';
import { figureProblems } from './figureSchema.js';
import './figure.css';

/*
 * A guide picture that makes a place unmistakable: the image, optional numbered pins and one arrow drawn on top
 * (positions in % of the image, so they hold at any size), a visible key that names each pin (what a screen
 * reader hears too), and a caption. Sizes are always given, so nothing shifts while it loads. Only layout lives
 * in figure.css; colours come from --zh-figure-* variables a map or look sets.
 *
 *   <GuideFigure src alt caption width height srcSet={[{ src, width }]} sizes pins={[{ n, x, y, label }]}
 *                arrow={{ from: [x, y], to: [x, y] }} focus="50% 30%" priority zoom />
 * priority: the page's first, above-the-fold figure (eager, fetchpriority high). Others load lazily.
 * zoom: tap opens the full picture in a dialog (Esc, Close or the backdrop closes it; focus returns).
 */
export default function GuideFigure({ src, alt, caption, width, height, srcSet, sizes = '(min-width: 1024px) 50vw, 100vw', pins = [], arrow, focus, priority = false, zoom = false, className = '' }) {
  const dialogRef = useRef(null);
  if (import.meta.env?.DEV) {
    const problems = figureProblems({ src, alt, caption, width, height, srcSet, pins, arrow, focus }, `GuideFigure ${src}`);
    if (problems.length) console.warn(problems.join('\n'));
  }
  const img = (
    <img
      src={src}
      srcSet={srcSet?.map((entry) => `${entry.src} ${entry.width}w`).join(', ')}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
  const overlay = (pins.length > 0 || arrow) && (
    <div className="zh-figure__overlay" aria-hidden="true">
      {arrow && (
        <svg className="zh-figure__arrow" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1={arrow.from[0]} y1={arrow.from[1]} x2={arrow.to[0]} y2={arrow.to[1]} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {pins.map((pin) => (
        <span key={pin.n} className="zh-figure__pin" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>{pin.n}</span>
      ))}
    </div>
  );
  const frame = (
    <div className="zh-figure__frame" style={{ aspectRatio: `${width} / ${height}` }}>
      {img}
      {overlay}
    </div>
  );

  return (
    <figure className={`zh-figure ${className}`.trim()}>
      {zoom ? (
        <button type="button" className="zh-figure__open" onClick={() => dialogRef.current?.showModal?.()} aria-label={`Enlarge: ${alt}`}>{frame}</button>
      ) : frame}
      {pins.length > 0 && (
        <ol className="zh-figure__key">
          {pins.map((pin) => <li key={pin.n} value={pin.n}>{pin.label}</li>)}
        </ol>
      )}
      {caption && <figcaption>{caption}</figcaption>}
      {zoom && (
        <dialog ref={dialogRef} className="zh-figure__dialog" aria-label={alt} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
          <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
          <button type="button" className="zh-figure__close" onClick={() => dialogRef.current?.close()}>Close</button>
        </dialog>
      )}
    </figure>
  );
}
