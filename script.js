// Daybreak Coffee - homepage banner animation
// Now that the group's tech constraints allow fuller use of JavaScript,
// the whole "coffee rain" effect (position, fade in/out, and rotation)
// is driven by a requestAnimationFrame loop in this file rather than
// CSS @keyframes. CSS only provides the base look and a static
// no-JS/noscript fallback (see index.html + styles.css).

(function () {
  "use strict";

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initCoffeeRain() {
    var container = document.querySelector(".coffee-rain");
    if (!container) {
      return;
    }

    var options = {
      cupCount: 12,
      minSpeed: 28, // pixels per second
      maxSpeed: 46,
      minLeftPercent: 4,
      maxLeftPercent: 96,
      minRotation: -20,
      maxRotation: 20
    };

    var cups = [];
    var rafId = null;
    var lastTimestamp = null;

    function makeCupElement() {
      var cup = document.createElement("span");
      cup.className = "cup";
      cup.setAttribute("aria-hidden", "true");
      cup.textContent = "\u2615"; // ☕
      container.appendChild(cup);
      return cup;
    }

    // Gives a cup a brand-new random horizontal position, fall speed,
    // and rotation amount. When startAboveView is true the cup starts
    // somewhere above the visible area (used for the very first frame
    // so cups don't all appear to drop in unison).
    function randomizeCup(state, startAboveView) {
      state.left = randomBetween(options.minLeftPercent, options.maxLeftPercent);
      state.speed = randomBetween(options.minSpeed, options.maxSpeed);
      state.rotation = randomBetween(options.minRotation, options.maxRotation);
      state.y = startAboveView ? randomBetween(-160, -20) : -30;
      state.el.style.left = state.left.toFixed(1) + "%";
    }

    // Reduced-motion visitors get a calm, motionless arrangement instead
    // of a moving loop, honoring prefers-reduced-motion.
    function buildStaticLayout() {
      cups.forEach(function (state) {
        state.left = randomBetween(options.minLeftPercent, options.maxLeftPercent);
        state.el.style.left = state.left.toFixed(1) + "%";
        state.el.style.top = "38%";
        state.el.style.opacity = "0.6";
        state.el.style.transform = "none";
      });
    }

    function tick(timestamp) {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      var deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      var containerHeight = container.clientHeight || 220;
      var travelDistance = containerHeight + 60;

      cups.forEach(function (state) {
        state.y += state.speed * deltaSeconds;

        var progress = (state.y + 30) / travelDistance;
        var opacity;
        if (progress < 0.08) {
          opacity = (progress / 0.08) * 0.9;
        } else if (progress > 0.92) {
          opacity = ((1 - progress) / 0.08) * 0.9;
        } else {
          opacity = 0.9;
        }
        opacity = Math.max(0, Math.min(0.9, opacity));

        var clampedProgress = Math.min(Math.max(progress, 0), 1);
        state.el.style.transform =
          "translateY(" + state.y.toFixed(1) + "px) rotate(" +
          (state.rotation * clampedProgress).toFixed(1) + "deg)";
        state.el.style.opacity = opacity.toFixed(2);

        // Once a cup has fully fallen through, respawn it at the top
        // with fresh random values so the rain keeps feeling organic.
        if (state.y > travelDistance - 30) {
          randomizeCup(state, false);
        }
      });

      rafId = window.requestAnimationFrame(tick);
    }

    for (var i = 0; i < options.cupCount; i++) {
      var el = makeCupElement();
      var state = { el: el, y: 0, speed: 0, left: 0, rotation: 0 };
      randomizeCup(state, true);
      cups.push(state);
    }

    if (prefersReducedMotion()) {
      buildStaticLayout();
    } else {
      rafId = window.requestAnimationFrame(tick);
    }

    // Respond live if the visitor changes their OS-level motion
    // preference while the page is open, without needing a reload.
    if (window.matchMedia) {
      var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      var handleMotionChange = function (event) {
        if (event.matches) {
          if (rafId !== null) {
            window.cancelAnimationFrame(rafId);
            rafId = null;
          }
          buildStaticLayout();
        } else {
          lastTimestamp = null;
          cups.forEach(function (state) {
            randomizeCup(state, true);
          });
          rafId = window.requestAnimationFrame(tick);
        }
      };

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        // Safari < 14 fallback
        motionQuery.addListener(handleMotionChange);
      }
    }
  }

  function initBannerVideo() {
    var video = document.querySelector(".banner-video");
    if (!video) {
      return;
    }

    function applyMotionPreference() {
      if (prefersReducedMotion()) {
        video.pause();
      } else {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            // Autoplay can be blocked by the browser; the poster image
            // (images/header.png) remains visible as a static fallback.
          });
        }
      }
    }

    applyMotionPreference();

    if (window.matchMedia) {
      var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      var handleVideoMotionChange = function () {
        applyMotionPreference();
      };

      if (typeof motionQuery.addEventListener === "function") {
        motionQuery.addEventListener("change", handleVideoMotionChange);
      } else if (typeof motionQuery.addListener === "function") {
        // Safari < 14 fallback
        motionQuery.addListener(handleVideoMotionChange);
      }
    }
  }

  function initAll() {
    initCoffeeRain();
    initBannerVideo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
