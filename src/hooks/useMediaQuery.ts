import { useState, useEffect } from "react";

/**
 * Subscribes to a derived boolean (matches/no-matches) rather than the raw
 * window width. Follows the Vercel derived-state rule: the component only
 * re-renders when the boolean flips, not on every pixel of resize.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
