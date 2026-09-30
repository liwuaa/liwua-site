(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  let pending = false;
  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.4;

  const apply = () => {
    pending = false;
    root.style.setProperty("--mx", `${x}px`);
    root.style.setProperty("--my", `${y}px`);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      document.body.classList.add("is-pointer");
      if (!pending) {
        pending = true;
        requestAnimationFrame(apply);
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      document.body.classList.remove("is-pointer");
    },
    { passive: true }
  );
})();
