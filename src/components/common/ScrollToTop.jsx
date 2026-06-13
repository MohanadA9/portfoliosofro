import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("main").forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
