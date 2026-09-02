// Daybreak Coffee - homepage banner animation
// Generates the falling coffee cup elements with slightly randomized
// positions and timing so the animation feels a bit more organic.
// If this script fails to load or run, the <noscript> markup in
// index.html provides a static fallback so the page still works.

(function () {
  "use strict";

  function initCoffeeRain() {
    var container = document.querySelector(".coffee-rain");
    if (!container) {
      return;
    }

    var cupCount = 12;
    var minDurationSeconds = 6;
    var maxDurationSeconds = 8;
    var maxDelaySeconds = 3.5;
    var minLeftPercent = 4;
    var maxLeftPercent = 96;

    for (var i = 0; i < cupCount; i++) {
      var cup = document.createElement("span");
      cup.className = "cup";
      cup.setAttribute("aria-hidden", "true");
      cup.textContent = "\u2615"; // ☕

      var left = (Math.random() * (maxLeftPercent - minLeftPercent) + minLeftPercent).toFixed(1);
      var duration = (Math.random() * (maxDurationSeconds - minDurationSeconds) + minDurationSeconds).toFixed(1);
      var delay = (Math.random() * maxDelaySeconds).toFixed(1);

      cup.style.left = left + "%";
      cup.style.animationDuration = duration + "s";
      cup.style.animationDelay = delay + "s";

      container.appendChild(cup);
    }
  }

  // The prefers-reduced-motion media query in styles.css already disables
  // the falling animation for users who request reduced motion, so we
  // don't need to duplicate that logic here — we just generate the cups
  // and let CSS decide whether they move.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCoffeeRain);
  } else {
    initCoffeeRain();
  }
})();
