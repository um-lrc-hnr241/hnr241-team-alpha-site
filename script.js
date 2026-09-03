// Daybreak Coffee - homepage banner animation
// Generates the falling coffee cup elements and keeps re-randomizing
// their position/speed on every animation loop so the "coffee rain"
// feels organic and never repeats in a fixed pattern.
// If this script fails to load or run, the <noscript> markup in
// index.html provides a static fallback so the page still works.

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

  // Applies a fresh random horizontal position and fall speed to a cup.
  function styleCup(cup, options) {
    var left = randomBetween(
      options.minLeftPercent,
      options.maxLeftPercent
    ).toFixed(1);
    var duration = randomBetween(
      options.minDurationSeconds,
      options.maxDurationSeconds
    ).toFixed(1);

    cup.style.left = left + "%";
    cup.style.animationDuration = duration + "s";
  }

  function initCoffeeRain() {
    var container = document.querySelector(".coffee-rain");
    if (!container) {
      return;
    }

    var reduced = prefersReducedMotion();

    var options = {
      cupCount: 12,
      minDurationSeconds: 6,
      maxDurationSeconds: 8,
      maxDelaySeconds: 3.5,
      minLeftPercent: 4,
      maxLeftPercent: 96
    };

    for (var i = 0; i < options.cupCount; i++) {
      var cup = document.createElement("span");
      cup.className = "cup";
      cup.setAttribute("aria-hidden", "true");
      cup.textContent = "\u2615"; // ☕

      styleCup(cup, options);

      if (!reduced) {
        var delay = randomBetween(0, options.maxDelaySeconds).toFixed(1);
        cup.style.animationDelay = delay + "s";

        // Each time a cup finishes one fall cycle, give it a brand new
        // random starting position and speed. This is what keeps the
        // rain feeling continuous and varied instead of a short,
        // obviously-looping animation.
        cup.addEventListener("animationiteration", function () {
          styleCup(this, options);
        });
      }
      // When reduced motion is preferred, styles.css disables the
      // animation entirely and positions cups statically, so we skip
      // the delay/respawn logic above for those users.

      container.appendChild(cup);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCoffeeRain);
  } else {
    initCoffeeRain();
  }
})();
