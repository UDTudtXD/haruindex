const body = document.body;
const toggleButton = document.querySelector(".theme-toggle");
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const revealElements = document.querySelectorAll(".reveal");
const scrollProgress = document.querySelector(".scroll-progress");

const themes = {
  light: {
    label: "Light Mode",
    next: "dark",
  },
  dark: {
    label: "Dark Mode",
    next: "light",
  },
};

const savedTheme = localStorage.getItem("haru-theme");
if (savedTheme) {
  body.dataset.theme = savedTheme;
  toggleButton.textContent = themes[savedTheme].label;
  toggleButton.setAttribute("aria-pressed", savedTheme === "dark");
}

toggleButton.addEventListener("click", () => {
  const currentTheme = body.dataset.theme || "light";
  const nextTheme = themes[currentTheme].next;
  body.dataset.theme = nextTheme;
  toggleButton.textContent = themes[nextTheme].label;
  toggleButton.setAttribute("aria-pressed", nextTheme === "dark");
  localStorage.setItem("haru-theme", nextTheme);
});

let cursorActivated = false;

const activateCursor = () => {
  if (!cursorActivated) {
    body.classList.add("cursor-active");
    cursorActivated = true;
  }
};

const updateCursor = (event) => {
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX}px`;
  cursorDot.style.top = `${clientY}px`;
  cursorOutline.style.left = `${clientX}px`;
  cursorOutline.style.top = `${clientY}px`;
  activateCursor();
};

const hoverTargets = document.querySelectorAll("a, button");
hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
  target.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
});

const pointerFine = window.matchMedia("(pointer: fine)").matches;
if (pointerFine) {
  window.addEventListener("mousemove", updateCursor);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();
