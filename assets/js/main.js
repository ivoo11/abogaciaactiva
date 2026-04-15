(() => {
  // Año en footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contacto
  const form = document.getElementById("contactForm");
  const ok = document.getElementById("contactOk");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const nombre = (data.get("nombre") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const mensaje = (data.get("mensaje") || "").toString().trim();

      const subject = encodeURIComponent("Contacto — Abogacía Activa");
      const body = encodeURIComponent(
        `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}\n`
      );

      window.location.href = `mailto:contacto@abogaciaactiva.ar?subject=${subject}&body=${body}`;

      if (ok) ok.classList.remove("d-none");
      form.reset();
    });
  }

  // Modal propuestas
  const proposalModal = document.getElementById("proposalModal");
  if (proposalModal) {
    const modalTitle = document.getElementById("proposalModalLabel");
    const modalSummary = document.getElementById("proposalModalSummary");
    const modalCopy = document.getElementById("proposalModalCopy");

    proposalModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const title = trigger.getAttribute("data-title") || "";
      const summary = trigger.getAttribute("data-summary") || "";
      const copy = trigger.getAttribute("data-copy") || "";

      modalTitle.textContent = title;
      modalSummary.textContent = summary;
      modalCopy.textContent = copy;
    });

    document.querySelectorAll(".proposal-card--clickable").forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // Chips propuestas
  const chips = document.querySelectorAll(".proposal-chip");
  const sections = document.querySelectorAll(".proposals-header[id]");
  const mainNav = document.getElementById("mainNav");
  const chipsWrap = document.querySelector(".proposals-subnav-wrap");

  if (chips.length && sections.length && mainNav && chipsWrap) {
    const getOffset = () => {
      const navHeight = Math.ceil(mainNav.getBoundingClientRect().height) || 0;
      const chipsHeight = Math.ceil(chipsWrap.getBoundingClientRect().height) || 0;
      return navHeight + chipsHeight + 12;
    };

    const setActiveChip = (id) => {
      chips.forEach((chip) => {
        const isActive = chip.getAttribute("href") === `#${id}`;
        chip.classList.toggle("is-active", isActive);
      });
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const href = chip.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const targetY =
          target.getBoundingClientRect().top + window.scrollY - getOffset();

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });

        history.replaceState(null, "", href);
        setActiveChip(href.replace("#", ""));
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveChip(visible[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.3, 0.5, 0.7],
      }
    );

    sections.forEach((section) => observer.observe(section));

    if (sections[0]) {
      setActiveChip(sections[0].id);
    }
  }

  // Navbar + anchors + scrollspy
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const body = document.body;
    const nav = document.getElementById("mainNav");
    const navCollapse = document.getElementById("navLinks");
    const anchorLinks = document.querySelectorAll('#mainNav a[href^="#"]');

    if (!nav) return;

    function getCollapsedNavHeight() {
      const wasOpen = navCollapse && navCollapse.classList.contains("show");

      if (!navCollapse || !wasOpen || window.innerWidth >= 992) {
        return Math.ceil(nav.getBoundingClientRect().height);
      }

      navCollapse.classList.remove("show");
      const height = Math.ceil(nav.getBoundingClientRect().height);
      navCollapse.classList.add("show");

      return height;
    }

    function updateNavMetrics() {
      const navHeight = getCollapsedNavHeight();

      root.style.setProperty("--nav-height", `${navHeight}px`);
      root.style.setProperty("--anchor-offset", `${navHeight + 12}px`);
      root.style.setProperty("--proposals-subnav-offset", `${navHeight + 6}px`);

      const spyInstance = bootstrap.ScrollSpy.getInstance(body);
      if (spyInstance) {
        spyInstance.dispose();
      }

      new bootstrap.ScrollSpy(body, {
        target: "#mainNav",
        offset: navHeight + 16,
      });
    }

    function scrollToHash(hash) {
      const target = document.querySelector(hash);
      if (!target) return;

      const navHeight = getCollapsedNavHeight();
      const extraGap = 0;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight - extraGap;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      history.replaceState(null, "", hash);
    }

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href");
        if (!hash || !hash.startsWith("#")) return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        const isMobile = window.innerWidth < 992;
        const isMenuOpen =
          navCollapse && navCollapse.classList.contains("show");

        if (isMobile && isMenuOpen) {
          navCollapse.addEventListener(
            "hidden.bs.collapse",
            () => {
              updateNavMetrics();
              requestAnimationFrame(() => {
                scrollToHash(hash);
              });
            },
            { once: true }
          );

          bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        } else {
          scrollToHash(hash);
        }
      });
    });

    window.addEventListener("load", updateNavMetrics);
    window.addEventListener("resize", updateNavMetrics);

    if (navCollapse) {
      navCollapse.addEventListener("shown.bs.collapse", updateNavMetrics);
      navCollapse.addEventListener("hidden.bs.collapse", updateNavMetrics);
    }

    updateNavMetrics();
  });
})();

// CONTADOR

const countdown = document.getElementById("electionCountdown");
const inlineDays = document.getElementById("countdownDaysInline");

if (countdown) {
  const targetDate = countdown.getAttribute("data-election-date");

  const daysEl = countdown.querySelector('[data-unit="days"]');
  const hoursEl = countdown.querySelector('[data-unit="hours"]');
  const minutesEl = countdown.querySelector('[data-unit="minutes"]');
  const secondsEl = countdown.querySelector('[data-unit="seconds"]');

  const pad = (n) => String(n).padStart(2, "0");

  const update = () => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);

    if (inlineDays) inlineDays.textContent = days;
  };

  update();
  setInterval(update, 1000);
}