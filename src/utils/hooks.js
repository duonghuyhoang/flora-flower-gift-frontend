import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function useLocalStorage(key) {
  const [value, setValue] = useState(localStorage.getItem(key));

  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        setValue(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return value;
}
export { useLocalStorage };

const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
};

export { useScrollToTop };
