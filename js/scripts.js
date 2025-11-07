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

  // Initialize Bootstrap 5 Tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      html: true,
      placement: "top",
      trigger: "hover focus click",
      animation: true,
    });
  });

  // Prevent default on divs if needed
  $('[role="button"]').on("click", function (e) {
    e.preventDefault();
  });
});
