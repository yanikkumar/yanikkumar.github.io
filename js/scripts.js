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
  let autoCycleInterval = null; // For auto-show timer
  let isAutoMode = true; // Track if auto-cycle is running

  // Function to hide all tooltips
  function hideAllTooltips() {
    tooltips.forEach((tt) => tt.hide());
  }

  // Function to show a specific tooltip (hides others first)
  function showSpecificTooltip(index) {
    hideAllTooltips();
    if (tooltips[index]) {
      tooltips[index].show();
    }
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
        // Stop auto-cycle on user interaction
        clearInterval(autoCycleInterval);
        isAutoMode = false;
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

  // Auto-show cycle: Show each tooltip for 3 seconds, then next
  function startAutoCycle() {
    let currentIndex = 0;
    const cycleDuration = 3000; // 3 seconds per tooltip

    autoCycleInterval = setInterval(() => {
      showSpecificTooltip(currentIndex);
      currentIndex = (currentIndex + 1) % tooltips.length; // Loop back to 0 after last
    }, cycleDuration);

    // Stop after one full cycle (5 tooltips)
    setTimeout(() => {
      clearInterval(autoCycleInterval);
      hideAllTooltips();
      isAutoMode = false;
    }, tooltips.length * cycleDuration);
  }

  // Start auto-cycle after a short delay (e.g., 1 second after load for smooth entry)
  setTimeout(startAutoCycle, 1000);

  // Prevent default on divs if needed (unchanged, but now won't interfere with tooltips)
  $('[role="button"]').on("click", function (e) {
    e.preventDefault();
  });
});
