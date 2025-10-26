import { useEffect } from "react";

export default function useVhConfig() {
  useEffect(() => {
    // guardamos o timer para debounce
    let timer: number | null = null;

    function getViewportHeight() {
      // se visualViewport existir, é mais preciso em mobile
      if (window.visualViewport && typeof window.visualViewport.height === "number") {
        return window.visualViewport.height;
      }
      return window.innerHeight;
    }

    function setVh() {
      const vh = getViewportHeight() * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    // debounce simples para evitar execuções excessivas no resize
    const onResize = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setVh();
        timer = null;
      }, 120);
    };

    // set inicial
    setVh();

    // listeners
    window.addEventListener("resize", onResize);
    // visualViewport também emite 'resize'/'scroll' e pode ajudar — atualiza quando disponível
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onResize);
      window.visualViewport.addEventListener("scroll", onResize);
    }
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("fullscreenchange", onResize);

    return () => {
      // cleanup: remover todos os listeners adicionados
      window.removeEventListener("resize", onResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onResize);
        window.visualViewport.removeEventListener("scroll", onResize);
      }
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("fullscreenchange", onResize);
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };
  }, []);
}
