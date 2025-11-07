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
      tt.hide(); // Always attempt hide, even if not visible
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

    console.log(`Showing tooltip ${index}`); // Debug: Check console for sequence (remove later)

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

  // Initialize tooltips with auto placement for better positioning
  tooltipTriggerList.forEach((tooltipTriggerEl, index) => {
    // Special case for heart: Use 'bottom' on desktop for more space
    let placement = "auto";
    if (
      tooltipTriggerEl.classList.contains("heart") &&
      window.innerWidth > 768
    ) {
      placement = "bottom";
    }

    const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
      html: true,
      placement: placement,
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

    // Hide on outside click (improved: check against all triggers)
    $(document).on("click", function (e) {
      let shouldHide = true;
      tooltipTriggerList.forEach((trigger) => {
        if ($(e.target).closest(trigger).length > 0) {
          shouldHide = false;
        }
      });
      if (shouldHide && tooltip.getTipElement()) {
        tooltip.hide();
      }
    });
  });

  // Stop auto on scroll
  $(window).on("scroll", function () {
    if (isAutoMode) {
      console.log("Auto stopped due to scroll"); // Debug
      isAutoMode = false;
      hideAllTooltips();
    }
  });

  // Start auto-cycle on window load (ensures images/animations settle, no delay feel)
  $(window).on("load", function () {
    if (tooltips.length > 0 && isAutoMode) {
      console.log("Starting auto-cycle"); // Debug
      showNext(0);
    }
  });

  // Prevent default on divs if needed (unchanged, but now won't interfere with tooltips)
  $('[role="button"]').on("click", function (e) {
    e.preventDefault();
  });
});
