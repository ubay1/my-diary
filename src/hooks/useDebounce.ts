import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 500) {
  const [lastDebounced, setlastDebounced] = useState("");
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value)
      setlastDebounced(debounced as string);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay, debounced]);

  return { debounced, lastDebounced };
}