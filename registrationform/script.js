/* =========================================
   Student Registration Form - Validation
   ========================================= */

// Grab the form and success message element
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");

/**
 * Show an error message for a given field and mark it invalid.
 */
function showError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  if (inputEl) {
    inputEl.classList.add("input-error");
    inputEl.classList.remove("input-valid");
  }
}

/**
 * Clear the error and mark the field valid.
 */
function showValid(inputEl, errorEl) {
  errorEl.textContent = "";
  if (inputEl) {
    inputEl.classList.remove("input-error");
    inputEl.classList.add("input-valid");
  }
}

/* --------- Individual validators --------- */

function validateFullName() {
  const input = document.getElementById("fullName");
  const err = document.getElementById("fullNameError");
  const value = input.value.trim();
  input.value = value; // remove leading/trailing spaces
  const regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

  if (value === "") {
    showError(input, err, "Full Name is required.");
    return false;
  }

  if (!regex.test(value)) {
    showError(input, err, "Full Name must contain only alphabets.");
    return false;
  }

  showValid(input, err);
  return true;
}

function validateRollNumber() {
  const input = document.getElementById("rollNumber");
  const err = document.getElementById("rollNumberError");
  const value = input.value.trim();
  input.value = value;
  const regex = /^[A-Za-z0-9]+$/;

  if (value === "" || !regex.test(value)) {
    showError(input, err, "Roll Number must contain only letters and numbers.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validateEmail() {
  const input = document.getElementById("email");
  const err = document.getElementById("emailError");
  const value = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "" || !regex.test(value)) {
    showError(input, err, "Please enter a valid Email ID.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validateMobile() {
  const input = document.getElementById("mobile");
  const err = document.getElementById("mobileError");
  const value = input.value.trim();
  const regex = /^[0-9]{10}$/;

  if (!regex.test(value)) {
    showError(input, err, "Mobile Number must contain exactly 10 digits.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validatePassword() {
  const input = document.getElementById("password");
  const err = document.getElementById("passwordError");
  const value = input.value;

  if (value.length < 8) {
    showError(input, err, "Password must be at least 8 characters long.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validateConfirmPassword() {
  const input = document.getElementById("confirmPassword");
  const err = document.getElementById("confirmPasswordError");
  const password = document.getElementById("password").value;
  const value = input.value;

  if (value === "" || value !== password) {
    showError(input, err, "Passwords do not match.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validateGender() {
  const err = document.getElementById("genderError");
  const selected = document.querySelector('input[name="gender"]:checked');

  if (!selected) {
    showError(null, err, "Please select your gender.");
    return false;
  }
  err.textContent = "";
  return true;
}

function validateDepartment() {
  const input = document.getElementById("department");
  const err = document.getElementById("departmentError");

  if (input.value === "") {
    showError(input, err, "Please select your department.");
    return false;
  }
  showValid(input, err);
  return true;
}

function validateDOB() {
  const input = document.getElementById("dob");
  const err = document.getElementById("dobError");

  if (input.value === "") {
    showError(input, err, "Please select your Date of Birth.");
    return false;
  }
  showValid(input, err);
  return true;
}

/* --------- Submit handler --------- */

form.addEventListener("submit", function (event) {
  event.preventDefault();
  successMessage.textContent = "";

  // Run all validators (avoid short-circuit so all errors show at once)
  const results = [
    validateFullName(),
    validateRollNumber(),
    validateEmail(),
    validateMobile(),
    validatePassword(),
    validateConfirmPassword(),
    validateGender(),
    validateDepartment(),
    validateDOB(),
  ];

  const allValid = results.every(Boolean);

  if (allValid) {
    successMessage.textContent = "Student Registration Successful!";
    // Clear form after brief delay so user sees the message
    setTimeout(() => {
      form.reset();
      document.querySelectorAll(".input-valid").forEach((el) =>
        el.classList.remove("input-valid")
      );
    }, 1500);
  }
});

/* --------- Reset handler: clear errors + states --------- */

document.getElementById("resetBtn").addEventListener("click", function () {
  successMessage.textContent = "";
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".input-error, .input-valid").forEach((el) => {
    el.classList.remove("input-error", "input-valid");
  });
});

/* --------- Live re-validation on input --------- */

const liveMap = {
  fullName: validateFullName,
  rollNumber: validateRollNumber,
  email: validateEmail,
  mobile: validateMobile,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  department: validateDepartment,
  dob: validateDOB,
};

Object.keys(liveMap).forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", liveMap[id]);
  if (el) el.addEventListener("change", liveMap[id]);
});

document.querySelectorAll('input[name="gender"]').forEach((el) =>
  el.addEventListener("change", validateGender)
);
