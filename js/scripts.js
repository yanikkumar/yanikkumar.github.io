$(document).ready(function () {
  // Your existing nav active handler (unchanged)
  $(".nav-item .nav-link").on("click", function () {
    $(".nav-item").find(".active").removeClass("active");
    $(this).addClass("active");

    // Clear all popovers on section switch
    $('[data-bs-toggle="popover"]').popover("hide");
  });

  // Your existing iframe/year code (unchanged)
  $("#linktreeModal iframe").attr("src", $("#linktreeBtn").attr("href"));

  function getCurrentYear() {
    return new Date().getFullYear();
  }
  $("#year").text(getCurrentYear());

  // ENHANCED Popover Setup with Full Single-Open Enforcement
  const popoverOptions = {
    trigger: "hover focus click", // Keeps click + hover
    delay: { show: 0, hide: 50 }, // Quick for both
    html: true,
  };

  // Initialize popovers
  const popoverTriggers = $('[data-bs-toggle="popover"]');
  popoverTriggers.popover(popoverOptions);

  // NEW: Global Single-Open - Close others BEFORE any show (covers click & hover)
  popoverTriggers.on("show.bs.popover", function () {
    const $this = $(this);
    const thisInstance = $this.data("bs.popover"); // Get current instance

    // Hide ALL other popovers immediately
    popoverTriggers.not($this).each(function () {
      const otherInstance = $(this).data("bs.popover");
      if (otherInstance && otherInstance._isShown && otherInstance._isShown()) {
        otherInstance.hide();
      } else {
        $(this).popover("hide");
      }
    });
  });

  // Retained: Hover debounce for anti-flash (optional, but keeps quick switches smooth)
  let hoverTimeout;
  popoverTriggers.on("mouseenter", function () {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      $(this).popover("show"); // Force show after debounce if needed
    }, 50);
  });

  popoverTriggers.on("mouseleave", function () {
    clearTimeout(hoverTimeout);
    $(this).popover("hide");
  });

  // Retained: Global hide on outside click
  $(document).on("click", function (e) {
    if (!$(e.target).closest('[data-bs-toggle="popover"]').length) {
      popoverTriggers.popover("hide");
    }
  });

  // Retained: Prevent default on divs if needed
  $('[role="button"]').on("click", function (e) {
    e.preventDefault();
  });
});
