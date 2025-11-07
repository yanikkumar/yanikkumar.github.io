(function () {
  // get all data in form and return object
  function getFormData(form) {
    var elements = form.elements;
    var honeypot;

    var fields = Object.keys(elements)
      .filter(function (k) {
        if (elements[k].name === "honeypot") {
          honeypot = elements[k].value;
          return false;
        }
        return true;
      })
      .map(function (k) {
        if (elements[k].name !== undefined) {
          return elements[k].name;
          // special case for Edge's html collection
        } else if (elements[k].length > 0) {
          return elements[k].item(0).name;
        }
      })
      .filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
      });

    var formData = {};
    fields.forEach(function (name) {
      var element = elements[name];

      // singular form elements just have one value
      formData[name] = element.value;

      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(", ");
      }
    });

    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    return { data: formData, honeypot: honeypot };
  }

  function showLoadingSpinner(form) {
    // Ensure form has relative positioning for overlay
    if (!form.style.position || form.style.position === "") {
      form.style.position = "relative";
    }

    form.classList.add("form-submitting");

    var overlay = form.querySelector(".form-loading-overlay");
    if (overlay) {
      overlay.classList.add("show");
    }

    // Disable all inputs and buttons
    disableAllButtons(form);
    disableAllInputs(form);
  }

  function hideLoadingSpinner(form) {
    form.classList.remove("form-submitting");

    var overlay = form.querySelector(".form-loading-overlay");
    if (overlay) {
      overlay.classList.remove("show");
    }

    // Re-enable all inputs
    enableAllInputs(form);
  }

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  function disableAllInputs(form) {
    var inputs = form.querySelectorAll("input, textarea");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }

  function enableAllInputs(form) {
    var inputs = form.querySelectorAll("input, textarea");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }
  }

  function enableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  }

  function handleFormSubmit(event) {
    // handles form submit without any jquery
    event.preventDefault(); // we are submitting via xhr below
    var form = event.target;
    var formData = getFormData(form);
    var data = formData.data;

    // If a honeypot field is filled, assume it was done so by a spam bot.
    if (formData.honeypot) {
      return false;
    }

    // Show loading spinner and disable form
    showLoadingSpinner(form);

    var url = form.action;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Success - hide spinner, reset form, show thank you message
          hideLoadingSpinner(form);
          form.reset();
          var formElements = form.querySelector(".form-elements");
          if (formElements) {
            formElements.style.display = "none"; // hide form
          }
          var thankYouMessage = form.querySelector(".thankyou_message");
          if (thankYouMessage) {
            thankYouMessage.style.display = "block";
          }
        } else {
          // Error - hide spinner and re-enable form
          hideLoadingSpinner(form);
          enableAllButtons(form);
          alert(
            "Sorry, there was an error submitting the form. Please try again."
          );
        }
      }
    };

    xhr.onerror = function () {
      // Network error - hide spinner and re-enable form
      hideLoadingSpinner(form);
      enableAllButtons(form);
      alert(
        "Sorry, there was a network error. Please check your connection and try again."
      );
    };

    // url encode form data for sending as post data
    var encoded = Object.keys(data)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      })
      .join("&");
    xhr.send(encoded);
  }

  function loaded() {
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form.gform");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  }
  document.addEventListener("DOMContentLoaded", loaded, false);
})();
