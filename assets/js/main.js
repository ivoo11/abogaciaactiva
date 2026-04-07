(() => {
  // Año en footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Cierra menú mobile al clickear un link
  const nav = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".navbar .nav-link");
  navLinks.forEach((a) => {
    a.addEventListener("click", () => {
      if (!nav) return;
      if (nav.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

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
    const modalNumber = document.getElementById("proposalModalNumber");
    const modalTitle = document.getElementById("proposalModalLabel");
    const modalSummary = document.getElementById("proposalModalSummary");
    const modalPoints = document.getElementById("proposalModalPoints");
    const modalCopy = document.getElementById("proposalModalCopy");

    proposalModal.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const number = trigger.getAttribute("data-number") || "";
      const title = trigger.getAttribute("data-title") || "";
      const summary = trigger.getAttribute("data-summary") || "";
      const copy = trigger.getAttribute("data-copy") || "";
      const pointsRaw = trigger.getAttribute("data-points") || "[]";

      let points = [];
      try {
        points = JSON.parse(pointsRaw);
        if (!Array.isArray(points)) points = [];
      } catch {
        points = [];
      }

      if (modalNumber) modalNumber.textContent = number;
      if (modalTitle) modalTitle.textContent = title;
      if (modalSummary) modalSummary.textContent = summary;
      if (modalCopy) modalCopy.textContent = copy;

      if (modalPoints) {
        modalPoints.innerHTML = "";
        points.forEach((point) => {
          const li = document.createElement("li");
          li.textContent = point;
          modalPoints.appendChild(li);
        });
      }
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
      const navHeight = mainNav.offsetHeight || 0;
      const chipsHeight = chipsWrap.offsetHeight || 0;
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
})();