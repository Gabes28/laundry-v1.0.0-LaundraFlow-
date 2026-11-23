// LAUNDRAFLOW AUTHENTICATION POPUP

const authOverlay = document.getElementById("lfAuthOverlay");
const authCard = document.getElementById("lfAuthCard");

const loginTrigger = document.querySelector(
    ".lf-auth-login-trigger"
);

const closeAuth = document.getElementById("lfAuthClose");

const registerLink = document.querySelector(
    ".lf-auth-register-link"
);

const loginLink = document.querySelector(
    ".lf-auth-login-link"
);

const forgotLink = document.querySelector(
    ".lf-auth-forgot-link"
);

const backToLoginLink = document.querySelector(
    ".lf-auth-back-login-link"
);


// OPEN LOGIN POPUP

function openAuthPopup() {
    authOverlay.classList.add("is-open");
    authOverlay.setAttribute("aria-hidden", "false");

    document.body.classList.add("lf-auth-lock");
}


// CLOSE LOGIN POPUP

function closeAuthPopup() {
    authOverlay.classList.remove("is-open");
    authOverlay.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lf-auth-lock");

    authCard.classList.remove("is-register", "is-forgot");

    if (lastAuthTrigger && lastAuthTrigger.isConnected) {
        lastAuthTrigger.focus();
    }
}


// LOGIN BUTTON - DESKTOP AND MOBILE

let lastAuthTrigger = null;

document.addEventListener("click", function(event) {

    const trigger = event.target.closest(
        ".lf-auth-login-trigger"
    );

    if (!trigger) return;

    event.preventDefault();

    lastAuthTrigger = trigger;

    openAuthPopup();
});


// CLOSE BUTTON

closeAuth.addEventListener("click", closeAuthPopup);


// CLOSE WHEN CLICKING OUTSIDE THE POPUP

authOverlay.addEventListener("click", function(event) {
    if (event.target === authOverlay) {
        closeAuthPopup();
    }
});


// OPEN REGISTRATION FORM

registerLink.addEventListener("click", function(event) {
    event.preventDefault();

    authCard.classList.add("is-register");
});


// RETURN TO LOGIN FORM

loginLink.addEventListener("click", function(event) {
    event.preventDefault();

    authCard.classList.remove("is-register");
});

// OPEN FORGOT PASSWORD FORM

forgotLink.addEventListener("click", function(event) {
    event.preventDefault();

    authCard.classList.remove("is-register");
    authCard.classList.add("is-forgot");
});


// RETURN FROM FORGOT PASSWORD TO LOGIN

backToLoginLink.addEventListener("click", function(event) {
    event.preventDefault();

    authCard.classList.remove("is-forgot");
    authCard.classList.remove("is-register");
});


// FORGOT PASSWORD FORM HANDLING

const forgotForm = document.querySelector(
    ".lf-auth-forgot-form"
);

forgotForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const status = forgotForm.querySelector(
        ".lf-auth-status"
    );

    status.textContent =
        "Password reset is not connected yet. Backend integration is required.";
});


// CLOSE USING ESCAPE KEY

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" &&
        authOverlay.classList.contains("is-open")) {
        closeAuthPopup();
    }
});


// PASSWORD VISIBILITY TOGGLE

document.querySelectorAll(
    ".lf-auth-password-toggle"
).forEach(function(button) {

    button.addEventListener("click", function() {

        const target = document.getElementById(
            button.dataset.target
        );

        const icon = button.querySelector("i");

        if (target.type === "password") {
            target.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
            button.setAttribute("aria-label", "Hide password");
        } else {
            target.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
            button.setAttribute("aria-label", "Show password");
        }
    });
});


// TEMPORARY FORM HANDLING
// Actual authentication requires a PHP/MySQL backend.

document.querySelectorAll(".lf-auth-form").forEach(function(form) {

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const status = form.querySelector(".lf-auth-status");

        status.textContent =
            "Authentication is not connected yet. Backend integration is required.";
    });

});