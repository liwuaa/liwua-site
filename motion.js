import {
  animate,
  createTimeline,
  createDraggable,
  createSpring,
  stagger,
  svg,
  utils,
} from "https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------- dot grid ------------------------------------ */

const buildDotGrid = () => {
  const grid = document.getElementById("dotGrid");
  if (!grid) return;
  const cols = 13;
  const rows = 9;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < cols * rows; i += 1) {
    const dot = document.createElement("span");
    dot.className = "dot";
    frag.appendChild(dot);
  }
  grid.appendChild(frag);
};

// Idle ambient "breathing" of the whole dot plane, plus pointer-reactive dots:
// dots near the cursor pulse up, the rest settle back. Replaces the previous
// fixed grid pulse with something that actually answers the cursor.
const bindDotGrid = () => {
  const grid = document.getElementById("dotGrid");
  const dots = document.querySelectorAll(".dot");
  if (!grid || !dots.length) return;

  if (reduce) {
    dots.forEach((d) => {
      d.style.opacity = "0.18";
      d.style.transform = "none";
    });
    return;
  }

  animate(grid, {
    scale: [1, 1.022, 1],
    duration: 4200,
    ease: "inOutSine",
    loop: true,
  });

  const cols = 13;
  const rows = 9;
  let px = -9999;
  let py = -9999;
  let raf = null;

  const render = () => {
    raf = null;
    const rect = grid.getBoundingClientRect();
    const c = ((px - rect.left) / rect.width) * cols;
    const r = ((py - rect.top) / rect.height) * rows;
    for (let i = 0; i < dots.length; i += 1) {
      const dc = i % cols;
      const dr = (i / cols) | 0;
      const dist = Math.hypot(dc - c, dr - r);
      if (dist < 2.4) {
        const k = 1 - dist / 2.4;
        dots[i].style.transform = `scale(${(1 + 0.6 * k).toFixed(3)})`;
        dots[i].style.opacity = (0.18 + 0.52 * k).toFixed(3);
      } else {
        dots[i].style.transform = "scale(1)";
        dots[i].style.opacity = "0.18";
      }
    }
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  grid.addEventListener("pointermove", (e) => {
    px = e.clientX;
    py = e.clientY;
    schedule();
  }, { passive: true });

  grid.addEventListener("pointerleave", () => {
    px = -9999;
    py = -9999;
    dots.forEach((d) => {
      d.style.transform = "scale(1)";
      d.style.opacity = "0.18";
    });
  });
};

/* ------------------------------ scroll reveal -------------------------------- */

const revealOnScroll = () => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (reduce) {
    items.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  let pending = items.length;
  const io = new IntersectionObserver(
    (entries) => {
      let delay = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        animate(el, {
          opacity: [0, 1],
          y: [20, 0],
          delay: delay * 90,
          duration: 700,
          ease: "out(3)",
        });
        delay += 1;
        io.unobserve(el);
        pending -= 1;
        if (pending === 0) io.disconnect();
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
};

/* ------------------------------ hero animations ------------------------------ */

const floatShapes = () => {
  const shapes = document.querySelectorAll(".shape");
  if (!shapes.length || reduce) return;

  shapes.forEach((shape) => {
    const wander = () => {
      animate(shape, {
        x: utils.random(-42, 42),
        y: utils.random(-36, 36),
        rotate: utils.random(-160, 160),
        duration: utils.random(1400, 2400),
        ease: "inOut(2)",
        composition: "blend",
        onComplete: wander,
      });
    };
    wander();
  });
};

const drawHeroPath = () => {
  const path = document.getElementById("drawPath");
  if (!path) return;
  const drawable = svg.createDrawable(path);
  if (reduce) {
    path.setAttribute("stroke-dasharray", `${path.getTotalLength()} 0`);
    return;
  }
  animate(drawable, {
    draw: ["0 0", "0 1"],
    ease: "inOut(3)",
    duration: 2200,
    delay: 350,
  });
};

// Gentle parallax: the floating shapes (whole layer) drift toward the cursor.
const bindHeroPointer = () => {
  const stage = document.querySelector(".hero-stage");
  const floaters = document.getElementById("floaters");
  if (!stage || !floaters || reduce) return;

  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let raf = null;

  const loop = () => {
    raf = null;
    sx += (cx - sx) * 0.09;
    sy += (cy - sy) * 0.09;
    floaters.style.transform = `translate3d(${(sx * 16).toFixed(2)}px, ${(sy * 12).toFixed(2)}px, 0)`;
    if (Math.abs(cx - sx) > 0.002 || Math.abs(cy - sy) > 0.002) {
      raf = requestAnimationFrame(loop);
    }
  };

  stage.addEventListener("pointermove", (e) => {
    const rect = stage.getBoundingClientRect();
    cx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    cy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  stage.addEventListener("pointerleave", () => {
    cx = 0;
    cy = 0;
  });
};

/* ----------------------------- playground demos ------------------------------ */

const runClock = () => {
  const ticks = document.querySelectorAll("#clock .tick");
  const hand = document.querySelector("#clock .hand");
  if (!ticks.length || !hand || reduce) return;

  createTimeline({
    loop: true,
    defaults: { ease: "out(2)" },
  })
    .add(ticks, {
      y: "-=5",
      duration: 70,
      delay: stagger(12),
    })
    .add(ticks, {
      y: 0,
      duration: 120,
      delay: stagger(12),
    }, "<40")
    .add(hand, {
      rotate: "+=30",
      duration: 420,
      ease: "inOut(3)",
    }, "<");
};

const bindSpringBall = () => {
  const ball = document.getElementById("springBall");
  if (!ball || reduce) return;

  createDraggable(ball, {
    container: ball.parentElement,
    releaseEase: createSpring({
      stiffness: 140,
      damping: 8,
    }),
  });

  ball.addEventListener("click", () => {
    animate(ball, {
      scale: [
        { to: 0.86, duration: 90 },
        { to: 1.08, duration: 180 },
        { to: 1, duration: 220 },
      ],
      ease: "out(3)",
    });
  });
};

// SVG wave draw — driven by a CSS transition so it can never conflict with
// other animations. Entering the viewport toggles .wave-in (dashoffset -> 0);
// leaving resets it instantly, and the next entry redraws automatically.
const drawWaveOnScroll = () => {
  const wave = document.querySelector(".wave");
  const panel = wave ? wave.closest(".panel") : null;
  const path = document.getElementById("wavePath");
  if (!wave || !path) return;

  const len = path.getTotalLength();
  wave.style.setProperty("--wave-len", `${len.toFixed(1)}`);

  if (reduce) {
    wave.classList.add("wave-in");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        wave.classList.toggle("wave-in", entry.isIntersecting);
      }
    },
    { threshold: 0, rootMargin: "0px 0px -10% 0px" }
  );
  io.observe(panel || wave);
};

/* ---------------------------------- boot ------------------------------------- */

buildDotGrid();
revealOnScroll();
bindDotGrid();
floatShapes();
drawHeroPath();
runClock();
bindSpringBall();
drawWaveOnScroll();
bindHeroPointer();
