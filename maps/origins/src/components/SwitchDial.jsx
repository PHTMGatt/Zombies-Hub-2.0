import React, { useId } from 'react';

// Clockwise degrees (screen space) that turn the base drawing — rounded end pointing right — to each direction.
export const DIRECTION_ANGLE = { Right: 0, Down: 90, Left: 180, Up: 270 };

/*
 * An accurate Lightning Staff switch: a ring with a bar through it. The flat handle sticks out of
 * the ring on one side; the rounded end sits inside the ring and points the arrow direction, marked
 * in red. `angle` is cumulative so practice turns animate forward instead of spinning back at 360°.
 */
export default function SwitchDial({ angle = 0, size = 44, className = '' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`switch-dial ${className}`.trim()}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a6ecff" />
          <stop offset="0.5" stopColor="#36a6dc" />
          <stop offset="1" stopColor="#0c5c88" />
        </linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fe3ff" />
          <stop offset="1" stopColor="#1f7db6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="21" fill="#04121e" stroke={`url(#${id}-ring)`} strokeWidth="6" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="rgba(120, 220, 255, 0.35)" strokeWidth="1" />
      <g className="switch-dial__arm" style={{ transform: `rotate(${angle}deg)` }}>
        <path
          d="M5 26.5 H39 a5.5 5.5 0 0 1 0 11 H5 a1.5 1.5 0 0 1 -1.5 -1.5 V28 a1.5 1.5 0 0 1 1.5 -1.5 Z"
          fill={`url(#${id}-bar)`}
          stroke="#03111c"
          strokeWidth="1.5"
        />
        <path d="M63 32 L56.5 26.5 V37.5 Z" fill="#ff4d4d" />
      </g>
    </svg>
  );
}
