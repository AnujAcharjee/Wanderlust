// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

function scrollFilters(direction) {
  document.getElementById("filtersTrack").scrollBy({
    left: direction * 300,
    behavior: "smooth",
  });
}

// Highlight active filter based on current URL param
(function () {
  const params = new URLSearchParams(window.location.search);
  const active = params.get("category");
  if (!active) return;
  document.querySelectorAll(".filter-item").forEach((btn) => {
    if (btn.value === active) btn.classList.add("active");
  });
})();
