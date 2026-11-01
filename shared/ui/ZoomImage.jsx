import React, { useRef } from 'react';
import './ZoomImage.css';

/*
 * A gameplay reference image (code chart, symbol table) that opens full screen on tap.
 * The full-screen view allows pinch zoom; Close, Esc or a tap on the dark backdrop dismisses it, and
 * focus returns to the image button. The original image is always what is shown: nothing is redrawn.
 */
export default function ZoomImage({ src, alt, width, height, caption, className = '' }) {
  const dialogRef = useRef(null);
  const open = () => dialogRef.current?.showModal?.();
  const close = () => dialogRef.current?.close?.();
  // A tap on the backdrop (the dialog element itself, not its image) closes the view.
  const onDialogClick = (event) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <figure className={`zoom-image ${className}`.trim()}>
      <button type="button" className="zoom-image__open" onClick={open} aria-label={`Enlarge: ${alt}`}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        <span className="zoom-image__hint" aria-hidden="true">Tap to enlarge</span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
      <dialog ref={dialogRef} className="zoom-image__dialog" aria-label={alt} onClick={onDialogClick}>
        <img src={src} alt={alt} width={width} height={height} />
        <button type="button" className="zoom-image__close" onClick={close}>Close</button>
      </dialog>
    </figure>
  );
}
