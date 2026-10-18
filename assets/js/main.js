// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- Defocus demo ----------
// Blur follows the thin-lens circle of confusion: c ∝ |1/d − 1/f|.
// Measure the blur and you can recover depth d. That is the cue we use.
const stage = document.querySelector("#defocus-stage");
if (stage) {
  const objects = [
    { d: 0.6, x: 12, y: 46, w: 22, h: 46, color: "#f5b13d", r: "14px", name: "0.6 m" },
    { d: 1.2, x: 38, y: 40, w: 14, h: 36, color: "#ef6f6c", r: "50%", name: "1.2 m" },
    { d: 2.2, x: 58, y: 34, w: 12, h: 28, color: "#3dd6c6", r: "8px", name: "2.2 m" },
    { d: 3.5, x: 76, y: 30, w: 9, h: 22, color: "#9b8cff", r: "50%", name: "3.5 m" },
    { d: 6.0, x: 88, y: 24, w: 6, h: 14, color: "#7fa7ff", r: "4px", name: "6.0 m" },
  ];
  const K = 7; // px of blur per diopter of defocus
  const els = objects.map((o) => {
    const el = document.createElement("div");
    el.className = "obj";
    Object.assign(el.style, {
      left: o.x + "%", top: o.y + "%", width: o.w + "%", height: o.h + "%",
      borderRadius: o.r, background: o.color,
    });
    const label = document.createElement("span");
    label.className = "label";
    label.style.left = o.x + o.w / 2 + "%";
    label.style.top = o.y + o.h + 3 + "%";
    stage.append(el, label);
    return { o, el, label };
  });

  const slider = document.querySelector("#focus-range");
  const out = document.querySelector("#focus-out");
  const modeBtns = document.querySelectorAll("[data-mode]");
  let mode = "rgb";

  const depthColor = (d) => {
    // near = bright, far = dark (log scale)
    const t = Math.min(1, Math.max(0, Math.log(d / 0.5) / Math.log(7 / 0.5)));
    const v = Math.round(240 - t * 200);
    return `rgb(${v},${v},${v})`;
  };

  function render() {
    const f = parseFloat(slider.value);
    out.textContent = f.toFixed(1) + " m";
    stage.classList.toggle("depth-mode", mode === "depth");
    els.forEach(({ o, el, label }) => {
      const blur = K * Math.abs(1 / o.d - 1 / f);
      if (mode === "depth") {
        el.style.filter = "none";
        el.style.background = depthColor(o.d);
        label.textContent = o.name;
      } else {
        el.style.filter = `blur(${blur.toFixed(2)}px)`;
        el.style.background = o.color;
        label.textContent = `blur ${blur.toFixed(1)}px`;
      }
    });
  }
  slider.addEventListener("input", render);
  modeBtns.forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode;
      modeBtns.forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
    })
  );
  render();
}

// ---------- Video attribution visual ----------
const vid = document.querySelector("#vid-wrap");
if (vid) {
  const framesEl = vid.querySelector(".vid-frames");
  const timeline = vid.querySelector(".timeline");
  const N = 6;
  // The "event" (object crossing the frame) peaks around frames 2–4.
  const importance = [0.15, 0.35, 0.9, 1.0, 0.55, 0.2];
  const frames = [];
  for (let i = 0; i < N; i++) {
    const fr = document.createElement("div");
    fr.className = "vid-frame";
    const x = 10 + i * 12, y = 55 - Math.sin((i / (N - 1)) * Math.PI) * 30;
    const blob = document.createElement("div");
    blob.className = "blob";
    blob.style.left = x + "%";
    blob.style.top = y + "%";
    const heat = document.createElement("div");
    heat.className = "heat";
    const a = importance[i];
    heat.style.background = `radial-gradient(circle at ${x + 13}% ${y + 13}%, rgba(61,214,198,${a}) 0%, rgba(155,140,255,${a * 0.5}) 22%, transparent 45%)`;
    fr.append(blob, heat);
    framesEl.append(fr);
    frames.push(fr);
  }
  const bars = [];
  const B = 36;
  for (let i = 0; i < B; i++) {
    const t = i / (B - 1);
    const v = 0.12 + 0.88 * Math.exp(-Math.pow((t - 0.5) / 0.17, 2));
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = Math.round(v * 100) + "%";
    timeline.append(bar);
    bars.push(bar);
  }

  const heatBtn = document.querySelector("#heat-toggle");
  heatBtn?.addEventListener("click", () => {
    const on = vid.classList.toggle("show-heat");
    heatBtn.setAttribute("aria-pressed", on);
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let step = 0;
  const tick = () => {
    frames.forEach((f, i) => f.classList.toggle("active", i === step % N));
    const lo = Math.floor(((step % N) / N) * B), hi = Math.floor((((step % N) + 1) / N) * B);
    bars.forEach((b, i) => b.classList.toggle("on", i >= lo && i < hi));
    step++;
  };
  tick();
  if (!reduce) setInterval(tick, 900);
}
