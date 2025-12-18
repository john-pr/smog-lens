import { useRef, useCallback, useEffect } from "react";

function useThrottledCallback(cb, ms) {
  const lastRef = useRef(0);
  const timerRef = useRef(null);
  const pendingRef = useRef(null);
  const cbRef = useRef(cb);

  // Keep cbRef in sync with the latest callback
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  return useCallback((...args) => {
    const now = performance.now();
    const remaining = ms - (now - lastRef.current);

    pendingRef.current = args;

    if (remaining <= 0) {
      lastRef.current = now;
      cbRef.current(...args);
      pendingRef.current = null;
      return;
    }

    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        lastRef.current = performance.now();
        if (pendingRef.current) cbRef.current(...pendingRef.current);
        pendingRef.current = null;
      }, remaining);
    }
  }, [ms]);
}

export { useThrottledCallback };