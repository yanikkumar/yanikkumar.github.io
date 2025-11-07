$(document).ready(function () {
  // Your existing nav active handler (unchanged)
  $(".nav-item .nav-link").on("click", function () {
    $(".nav-item").find(".active").removeClass("active");
    $(this).addClass("active");
  });

  // Your existing iframe/year code (unchanged)
  $("#linktreeModal iframe").attr("src", $("#linktreeBtn").attr("href"));

  function getCurrentYear() {
    return new Date().getFullYear();
  }
  $("#year").text(getCurrentYear());

  // Collect all tooltip elements
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltips = []; // Array to store initialized tooltip instances
  let isAutoMode = true; // Track if auto-cycle is running
  const showDuration = 3000; // Time to show each tooltip
  const pauseAfterHeart = 5000; // Additional wait after Heart

  // Function to hide all tooltips
  function hideAllTooltips() {
    tooltips.forEach((tt) => {
      if (tt.getTipElement()) {
        tt.hide();
      }
    });
  }

  // Function to show a specific tooltip (hides others first)
  function showSpecificTooltip(index) {
    hideAllTooltips();
    if (tooltips[index]) {
      tooltips[index].show();
    }
  }

  // Recursive function for auto-cycle
  function showNext(index) {
    if (!isAutoMode) return; // Stop if auto mode is off

    showSpecificTooltip(index);

    // Calculate delay to next
    let nextDelay = showDuration;
    if (index === tooltips.length - 1) {
      // After showing Heart
      nextDelay += pauseAfterHeart; // Add 5s pause after show time
    }

    // Schedule next after delay
    setTimeout(() => {
      if (isAutoMode) {
        const nextIndex = (index + 1) % tooltips.length;
        showNext(nextIndex);
      } else {
        hideAllTooltips(); // Ensure clean hide on stop
      }
    }, nextDelay);
  }

  // Initialize tooltips with click support
  tooltipTriggerList.forEach((tooltipTriggerEl, index) => {
    const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
      html: true,
      placement: "top",
      trigger: "hover focus click", // Keeps mobile/desktop support
      animation: true,
    });
    tooltips.push(tooltip);

    // Custom click handler: Hide others, show this one, and stop auto if running
    $(tooltipTriggerEl).on("click", function (e) {
      e.stopPropagation(); // Prevent bubbling
      hideAllTooltips();
      tooltip.show();
      if (isAutoMode) {
        isAutoMode = false; // Stop auto-cycle on user interaction
      }
    });

    // Optional: Hide on outside click (for better UX)
    $(document).on("click", function (e) {
      if (
        !$(e.target).closest(tooltipTriggerEl).length &&
        tooltip.getTipElement()
      ) {
        tooltip.hide();
      }
    });
  });

  // Stop auto on scroll
  $(window).on("scroll", function () {
    if (isAutoMode) {
      isAutoMode = false;
      hideAllTooltips();
    }
  });

  // Start auto-cycle immediately (starts with Developer)
  if (tooltips.length > 0) {
    showNext(0);
  }

  // Prevent default on divs if needed (unchanged, but now won't interfere with tooltips)
  $('[role="button"]').on("click", function (e) {
    e.preventDefault();
  });
});
