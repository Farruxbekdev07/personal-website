(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = [...document.querySelectorAll("[data-nav]")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
    themeButton.title =
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === "dark" ? "#0c1320" : "#f4f7ff";
  }

  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    setTheme(
      savedTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"),
    );
  } catch {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );
  }

  themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      /* Storage may be unavailable in private contexts. */
    }
  });

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    navLinks.classList.toggle("is-open", open);
  });
  navLinks
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });

  function updateActiveNavigation() {
    const marker = window.innerHeight * 0.34;
    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker)
        currentSection = section;
    });
    navItems.forEach((link) => {
      if (link.getAttribute("href") === "#" + currentSection.id)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  let scrollPending = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollPending) return;
      scrollPending = true;
      window.requestAnimationFrame(() => {
        updateActiveNavigation();
        scrollPending = false;
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", updateActiveNavigation, { passive: true });
  window.addEventListener("hashchange", () =>
    window.requestAnimationFrame(updateActiveNavigation),
  );
  updateActiveNavigation();

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => revealObserver.observe(element));
    root.classList.add("js-ready");
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("is-visible"));
  }

  const typingTarget = document.querySelector("#typed-tagline");
  const phrases = [
    "software and the web",
    "computer networks",
    "cybersecurity concepts",
  ];
  if (typingTarget && !reducedMotion) {
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;
    const typeNext = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      typingTarget.textContent = phrase.slice(0, characterIndex);
      let delay = deleting ? 45 : 75;
      if (characterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      } else if (characterIndex >= phrases[phraseIndex].length) {
        deleting = true;
        delay = 1450;
      }
      window.setTimeout(typeNext, delay);
    };
    window.setTimeout(typeNext, 1500);
  }

  const aboutTitleTarget = document.querySelector("#typed-about-title");
  const aboutTitles = ["IT Student", "Aspiring Developer", "Tech Enthusiast"];
  if (aboutTitleTarget && !reducedMotion) {
    let titleIndex = 0;
    let titleCharacter = aboutTitles[0].length;
    let removeTitle = true;
    const typeAboutTitle = () => {
      const title = aboutTitles[titleIndex];
      titleCharacter += removeTitle ? -1 : 1;
      aboutTitleTarget.textContent = title.slice(0, titleCharacter);
      let delay = removeTitle ? 42 : 76;
      if (titleCharacter <= 0) {
        removeTitle = false;
        titleIndex = (titleIndex + 1) % aboutTitles.length;
        delay = 320;
      } else if (titleCharacter >= aboutTitles[titleIndex].length) {
        removeTitle = true;
        delay = 1500;
      }
      window.setTimeout(typeAboutTitle, delay);
    };
    window.setTimeout(typeAboutTitle, 1500);
  }
  const yearTarget = document.querySelector("#current-year");
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();
})();
