import { useRef, useEffect } from "react";

export function useFirstRender() {
  const firstRender = useRef(false);

  useEffect(() => {
    if (!firstRender.current) firstRender.current = true;
  }, []);

  return firstRender.current;
}
