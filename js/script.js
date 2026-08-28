(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("progressBar");
  var themeToggle = document.getElementById("themeToggle");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var backToTop = document.getElementById("backToTop");
  var yearEl = document.getElementById("year");

  // ---------- Footer year ----------
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Theme toggle ----------
  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      root.setAttribute("data-theme", "light");
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  var storedTheme = null;
  try { storedTheme = localStorage.getItem("theme"); } catch (e) {}

  applyTheme(storedTheme || "light");

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---------- Mobile nav ----------
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // ---------- Scroll effects: header shadow, progress bar, scrollspy ----------
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    header.classList.toggle("scrolled", scrollY > 12);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";

    backToTop.style.opacity = scrollY > 500 ? "1" : "0";
    backToTop.style.pointerEvents = scrollY > 500 ? "auto" : "none";

    var current = "";
    var offset = 130;
    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom > offset) {
        current = sec.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  backToTop.style.transition = "opacity 200ms ease";
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  // ---------- Animated stat counters ----------
  var statEls = Array.prototype.slice.call(document.querySelectorAll(".stat-number"));
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var heroStats = document.querySelector(".hero-stats");
  if (heroStats && "IntersectionObserver" in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStats);
  } else {
    animateCounters();
  }

  // ---------- Experience filter ----------
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll("#expFilters .filter-btn"));
  var expItems = Array.prototype.slice.call(document.querySelectorAll("#expTimeline .timeline-item"));

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");

      expItems.forEach(function (item) {
        var tags = item.getAttribute("data-tags") || "";
        var show = filter === "all" || tags.indexOf(filter) !== -1;
        item.classList.toggle("filtered-out", !show);
      });
    });
  });

  // ---------- Accordion ----------
  var accordionHeaders = Array.prototype.slice.call(document.querySelectorAll(".accordion-header"));
  accordionHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var item = header.closest(".accordion-item");
      item.classList.toggle("open");
    });
  });

  // ---------- Copy email on contact card click ----------
  var copyHint = document.getElementById("copyHint");
  var copyCards = Array.prototype.slice.call(document.querySelectorAll(".contact-card[data-copy]"));

  copyCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      var text = card.getAttribute("data-copy");
      if (!text || !navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(text).then(function () {
        copyHint.textContent = "Copied " + text + " to clipboard!";
        copyHint.classList.add("show");
        setTimeout(function () { copyHint.classList.remove("show"); }, 2200);
      }).catch(function () {
        window.location.href = card.getAttribute("href");
      });
    });
  });
})();
