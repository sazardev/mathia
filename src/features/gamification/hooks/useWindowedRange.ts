import { useCallback, useEffect, useRef, useState } from "react";

export type WindowedRange = {
  start: number;
  end: number;
};

type WindowedScroll = {
  containerRef: (node: HTMLDivElement | null) => void;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  range: WindowedRange;
  viewportHeight: number;
};

const FALLBACK_VIEWPORT = 480;

export function useWindowedRange(
  itemCount: number,
  rowHeight: number,
  overscan = 5,
): WindowedScroll {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(FALLBACK_VIEWPORT);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (node === null) return;
    const measure = () => setViewportHeight(node.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const firstVisible = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const start = Math.max(0, firstVisible - overscan);
  const end = Math.min(itemCount, start + visibleCount + overscan * 2);

  return { containerRef, onScroll, range: { start, end }, viewportHeight };
}
