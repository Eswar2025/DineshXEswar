/* ==========================================================================
   Wispr Flow clone — interactions
   - Sticky nav shadow on scroll
   - Mobile nav toggle + dropdown accordions
   - Scroll-reveal (IntersectionObserver)
   - Hero anchor-tab active state (scroll spy)
   - Personalize tab switching
   - Floating download card show/dismiss
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Sticky navbar shadow ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });

    // On mobile, tapping a top-level item expands its dropdown accordion-style
    nav.querySelectorAll(".nav-item > .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.matchMedia("(max-width: 860px)").matches) {
          e.preventDefault();
          link.parentElement.classList.toggle("is-expanded");
        }
      });
    });

    // Close menu when an in-page link is chosen
    nav.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero tabs: scroll-spy active state ---------- */
  const tabLinks = Array.from(document.querySelectorAll(".ft-tab-link"));
  const sections = tabLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tabLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { threshold: 0.4, rootMargin: "-30% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Personalize tabs ---------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tabs__panel img");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.tab;
      tabBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === key)
      );
    });
  });

  /* ---------- Floating download card ---------- */
  const floatCard = document.getElementById("floatCard");
  const floatClose = document.getElementById("floatClose");
  let dismissed = false;
  if (floatCard) {
    const toggleCard = () => {
      if (dismissed) return;
      floatCard.classList.toggle("is-visible", window.scrollY > 700);
    };
    window.addEventListener("scroll", toggleCard, { passive: true });
    if (floatClose) {
      floatClose.addEventListener("click", () => {
        dismissed = true;
        floatCard.classList.remove("is-visible");
      });
    }
  }
})();
