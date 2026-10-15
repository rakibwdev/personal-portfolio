document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const snake = document.querySelector(".snake-progress");
  const snakeHead = document.querySelector(".snake-head");
  const year = document.querySelector("#year");
  let previousScrollY = window.scrollY;
  const roleText = document.querySelector(".role-text");


   if (roleText) {

        const roles = [
           "Digital experiences.",
           "Powerful web solutions.",
           "Modern web applications.",
           "Scalable digital products.",
           "High-performance websites."
        ];

        let roleIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;

        function typeEffect() {

            const currentRole = roles[roleIndex];

            if (isDeleting) {
                letterIndex--;
            } else {
                letterIndex++;
            }

            roleText.textContent = currentRole.substring(0, letterIndex);

            let speed = isDeleting ? 50 : 100;

            // Pause when a complete title is displayed.
            if (!isDeleting && letterIndex === currentRole.length) {
                isDeleting = true;
                speed = 1500;
            }

            // Move to the next title after deleting the current one.
            else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                roleIndex++;

                if (roleIndex >= roles.length) {
                    roleIndex = 0;
                }

                speed = 400;
            }

            setTimeout(typeEffect, speed);
        }

        typeEffect();
    }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const updateScrollDecorations = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
        : 0;

    if (header) {
      const scrollY = window.scrollY;
      header.classList.toggle("is-scrolled", scrollY > 16);

      if (scrollY <= 16) {
        header.classList.remove("is-compact");
      } else if (
        !mainNav?.classList.contains("is-open") &&
        scrollY > previousScrollY + 4
      ) {
        header.classList.add("is-compact");
      } else if (scrollY < previousScrollY - 4) {
        header.classList.remove("is-compact");
      }

      previousScrollY = scrollY;
    }

    if (snake && snakeHead) {
      snake.style.strokeDashoffset = String(1 - progress);
      const point = snake.getPointAtLength(snake.getTotalLength() * progress);
      snakeHead.setAttribute("cx", String(point.x));
      snakeHead.setAttribute("cy", String(point.y));
    }
  };

  let scrollFrame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(() => {
          updateScrollDecorations();
          scrollFrame = 0;
        });
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScrollDecorations, { passive: true });
  updateScrollDecorations();

  const closeMenu = () => {
    if (!menuToggle || !mainNav) {
      return;
    }

    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.classList.toggle("is-open", isOpen);
      mainNav.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 760) {
          closeMenu();
        }
      },
      { passive: true },
    );
  }

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );

  const fireflyContainer = document.querySelector(".hero-fireflies");

  if (fireflyContainer) {
    const fireflies = document.createDocumentFragment();

    for (let index = 0; index < 18; index += 1) {
      const firefly = document.createElement("span");
      const size = Math.random() * 16 + 12;

      firefly.style.top = `${Math.random() * 90}%`;
      firefly.style.left = `${Math.random() * 95}%`;
      firefly.style.width = `${size}px`;
      firefly.style.height = `${size}px`;
      firefly.style.animationDuration = `${Math.random() * 4 + 4}s`;
      firefly.style.animationDelay = `${-Math.random() * 6}s`;
      fireflies.appendChild(firefly);
    }

    fireflyContainer.replaceChildren(fireflies);
  }

  if (!motionPreference.matches && "IntersectionObserver" in window) {
    const revealItems = document.querySelectorAll(
      ".section-heading, .about-grid, .expertise-card, .skill-group, .project-card, .timeline-item, .education-list article, .contact-container",
    );
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -25px 0px" },
    );

    revealItems.forEach((item, index) => {
      item.classList.add("reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
      revealObserver.observe(item);
    });
    document.body.classList.add("js-motion");
  }

  const canvas = document.querySelector(".cursor-trail");
  const dot = document.querySelector(".cursor-dot");
  const context = canvas?.getContext("2d");

  if (!canvas || !dot || !context || !finePointer.matches || motionPreference.matches) {
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let lastX = 0;
  let lastY = 0;
  let hasPointerPosition = false;
  let canvasWidth = 0;
  let canvasHeight = 0;

  const resizeCanvas = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = Math.round(canvasWidth * pixelRatio);
    canvas.height = Math.round(canvasHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      dot.classList.add("is-visible");

      if (!hasPointerPosition) {
        lastX = mouseX;
        lastY = mouseY;
        hasPointerPosition = true;
      }
    },
    { passive: true },
  );

  document.addEventListener("pointerout", (event) => {
    if (event.relatedTarget === null) {
      dot.classList.remove("is-visible");
    }
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      dot.classList.add("is-hovering");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a, button") &&
      (!event.relatedTarget ||
        !(event.relatedTarget instanceof Element) ||
        !event.relatedTarget.closest("a, button"))
    ) {
      dot.classList.remove("is-hovering");
    }
  });

  const animateTrail = () => {
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "rgba(0, 0, 0, 0.24)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.globalCompositeOperation = "source-over";

    if (hasPointerPosition) {
      const distance = Math.hypot(mouseX - lastX, mouseY - lastY);

      if (distance > 0.5) {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(mouseX, mouseY);
        context.strokeStyle = "rgba(50, 56, 212, 0.42)";
        context.lineWidth = 2;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        lastX = mouseX;
        lastY = mouseY;
      }
    }

    window.requestAnimationFrame(animateTrail);
  };

  window.requestAnimationFrame(animateTrail);
});
