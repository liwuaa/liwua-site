import {
  animate,
  createTimeline,
  createDraggable,
  createSpring,
  onScroll,
  stagger,
  svg,
  utils,
} from "https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const revealCopy = () => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (reduce) {
    items.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  animate(items, {
    opacity: [0, 1],
    y: [20, 0],
    delay: stagger(90, { start: 120 }),
    duration: 900,
    ease: "out(3)",
  });
};

const pulseDots = () => {
  const dots = document.querySelectorAll(".dot");
  if (!dots.length || reduce) return;

  const options = {
    grid: [13, 9],
    from: "center",
  };

  createTimeline({
    loop: true,
    defaults: { ease: "inOutQuad" },
  })
    .add(dots, {
      scale: stagger([1.35, 0.55], options),
      opacity: stagger([0.85, 0.12], options),
      duration: 900,
    }, stagger(18, options))
    .add(dots, {
      scale: 1,
      opacity: 0.18,
      duration: 700,
    }, "+=200");
};

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
  if (!path || reduce) return;
  const drawable = svg.createDrawable(path);
  animate(drawable, {
    draw: ["0 0", "0 1"],
    ease: "inOut(3)",
    duration: 2200,
    delay: 350,
  });
};

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

const drawWaveOnScroll = () => {
  const path = document.getElementById("wavePath");
  if (!path || reduce) return;
  const drawable = svg.createDrawable(path);

  animate(drawable, {
    draw: ["0 0", "0 1", "1 1"],
    ease: "inOut(3)",
    duration: 1800,
    autoplay: onScroll({
      target: path.closest(".panel"),
      sync: 0.35,
      enter: "top bottom-=10%",
    }),
  });
};

buildDotGrid();
revealCopy();
pulseDots();
floatShapes();
drawHeroPath();
runClock();
bindSpringBall();
drawWaveOnScroll();
