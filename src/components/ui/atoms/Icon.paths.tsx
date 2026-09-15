import type { JSX } from "react";

export const ICON_PATHS = {
  home: <path d="M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5" />,
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  chart: <path d="M4 20h16M7 20v-6M12 20V6M17 20V10" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h4M12 6h8M4 12h10M18 12h2M4 18h6M14 18h6" />
      <circle cx="10" cy="6" r="1.6" />
      <circle cx="16" cy="12" r="1.6" />
      <circle cx="12" cy="18" r="1.6" />
    </>
  ),
  flame: (
    <path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-1.8.8-3.3 2-4.5.3 1.2 1 2 2 2.5-.3-2.3.2-5 1-7z" />
  ),
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chevronLeft: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  lightbulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.9 10.6c.6.5.9 1.4.9 2.4h6c0-1 .3-1.9.9-2.4A6 6 0 0 0 12 3z" />
    </>
  ),
  star: (
    <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z" />
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  zap: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  book: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2V4z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7V4z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  crown: (
    <>
      <path d="M3 17l2-9 4.5 4L12 5l2.5 7L19 8l2 9H3z" />
      <path d="M5 21h14" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </>
  ),
  play: <path d="M7 5l12 7-12 7V5z" />,
  pencil: (
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  ),
  eraser: <path d="M4 14l6-6 6 6-4 4H8l-4-4zM9 19h10" />,
  undo: <path d="M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
  notebook: (
    <>
      <path d="M5 4h11l3 3v13H5z" />
      <path d="M9 4v16M14 9h3M14 13h3" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  highlighter: (
    <>
      <path d="M6 14l7-7 4 4-7 7H6v-4z" />
      <path d="M4 20h6" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 19L19 5" />
      <path d="M9 5h10v10" />
    </>
  ),
  rectangle: <rect x="4" y="6" width="16" height="12" rx="1" />,
  ellipse: <ellipse cx="12" cy="12" rx="8" ry="5" />,
  line: <path d="M4 20L20 4" />,
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </>
  ),
  save: (
    <>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 3v6h8V3M8 21v-7h8v7" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v12" />
      <path d="M7 12l5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  curve: (
    <>
      <path d="M3 19h18M3 5v14" />
      <path d="M3 15c2-8 5-11 7-6s4 8 6 3 3-6.5 5-6.5" />
    </>
  ),
  zoomIn: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M21 21l-5.5-5.5M10 7v6M7 10h6" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M21 21l-5.5-5.5M7 10h6" />
    </>
  ),
  keyboard: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M6 9h.01M9 9h.01M12 9h.01M15 9h.01M18 9h.01M6 12h.01M18 12h.01M8 15h8" />
    </>
  ),
} satisfies Record<string, JSX.Element>;

export type IconName = keyof typeof ICON_PATHS;
