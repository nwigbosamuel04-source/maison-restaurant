// ========================================
// MAISON WEBSITE JAVASCRIPT
// ========================================


// ========================================
// 1. SUPABASE CONNECTION
// ========================================

const supabaseUrl =
    "https://mjufiszrixkrnwgmjhvc.supabase.co";

const supabaseKey =
    "sb_publishable_60sY7Rpq8jfGxkExsVuaAg_yLn3A0Oc";

let supabaseClient = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    supabaseClient = window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

    console.log("Maison Supabase connected.");
} else {
    console.error(
        "Supabase library did not load. Check the CDN script."
    );
}


// ========================================
// 2. MOBILE NAVIGATION
// ========================================

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const isOpen =
            navLinks.classList.contains("active");

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

}


// ========================================
// 3. PASSWORD VISIBILITY
// ========================================

const passwordToggles =
    document.querySelectorAll(".password-toggle");

passwordToggles.forEach(function (toggle) {

    toggle.addEventListener("click", function () {

        const targetId =
            this.getAttribute("data-target");

        const passwordInput =
            document.getElementById(targetId);

        if (!passwordInput) {
            return;
        }

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            this.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            this.textContent = "👁";

        }

    });

});


// ========================================
// 4. CURRENT PAGE
// ========================================

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


// ========================================
// 5. HOMEPAGE LOGIN PROTECTION
// ========================================

async function protectHomepage() {

    const isHomepage =
        currentPage === "" ||
        currentPage === "index.html";

    if (!isHomepage) {
        return;
    }

    if (!supabaseClient) {
        console.error(
            "Cannot verify login: Supabase is unavailable."
        );

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(
                "Session check failed:",
                error.message
            );

            return;
        }

        if (!data.session) {

            window.location.replace("login.html");

        }

    } catch (error) {

        console.error(
            "Homepage authentication failed:",
            error
        );

    }

}

protectHomepage();


// ========================================
// 6. NORMAL LOGIN
// ========================================

const loginForm =
    document.querySelector(
        "form.login-form:not(.signup-form)"
    );

if (
    loginForm &&
    currentPage === "login.html"
) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!supabaseClient) {

                alert(
                    "Connection error. Please refresh the page and try again."
                );

                return;
            }

            const emailInput =
                loginForm.querySelector("#email");

            const passwordInput =
                loginForm.querySelector("#password");

            if (!emailInput || !passwordInput) {

                console.error(
                    "Login email or password field is missing."
                );

                alert(
                    "Login form error. Please contact support."
                );

                return;
            }

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            if (!email || !password) {

                alert(
                    "Please enter your email and password."
                );

                return;
            }

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );

            try {

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Signing in...";
                }

                const {
    data,
    error
} = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo:
            "https://nwigbosamuel04-source.github.io/maison-restaurant/index.html"
});

                if (error) {

                    console.error(
                        "Login error:",
                        error.message
                    );

                    alert(
                        "LOGIN ERROR: " + error.message
                    );

                    return;
                }

                if (!data.session) {

                    alert(
                        "Login could not be completed. Please try again."
                    );

                    return;
                }

                console.log("Maison login successful.");

                window.location.replace("index.html");

            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                alert(
                    "Something went wrong. Please try again."
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.textContent = "Sign In";

                }

            }

        }
    );

}


// ========================================
// 7. SIGNUP
// ========================================

const signupForm =
    document.querySelector(".signup-form");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!supabaseClient) {

                alert(
                    "Connection error. Please refresh and try again."
                );

                return;
            }

            const emailInput =
                signupForm.querySelector("#email");

            const passwordInput =
                signupForm.querySelector("#password");

            const confirmPasswordInput =
                signupForm.querySelector("#confirm-password");

            if (
                !emailInput ||
                !passwordInput ||
                !confirmPasswordInput
            ) {

                console.error(
                    "Signup form fields are missing."
                );

                alert(
                    "Signup form error. Please check the form."
                );

                return;
            }

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;

            if (password !== confirmPassword) {

                alert(
                    "Your passwords do not match."
                );

                return;
            }

            if (password.length < 6) {

                alert(
                    "Your password must contain at least 6 characters."
                );

                return;
            }

            const submitButton =
                signupForm.querySelector(
                    'button[type="submit"]'
                );

            try {

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Creating account...";
                }

                const {
                    data,
                    error
                } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });

                if (error) {

                    alert(
                        "SIGNUP ERROR: " + error.message
                    );

                    console.error(
                        "Signup error:",
                        error
                    );

                    return;
                }

                if (data.session) {

                    alert(
                        "Your account has been created successfully."
                    );

                    window.location.replace("index.html");

                } else {

                    alert(
                        "Your account has been created. Check your email to verify your account before signing in."
                    );

                    window.location.replace("login.html");

                }

            } catch (error) {

                console.error(
                    "Unexpected signup error:",
                    error
                );

                alert(
                    "Something went wrong during signup."
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;
                    submitButton.textContent = "Create Account";

                }

            }

        }
    );

}


// ========================================
// 8. FORGOT PASSWORD
// ========================================

if (currentPage === "forgot-password.html") {

    const forgotPasswordForm =
        document.querySelector("form.login-form");

    if (forgotPasswordForm) {

        forgotPasswordForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (!supabaseClient) {

                    alert(
                        "Connection error. Please try again."
                    );

                    return;
                }

                const emailInput =
                    forgotPasswordForm.querySelector("#email");

                if (!emailInput) {

                    alert(
                        "Email field not found."
                    );

                    return;
                }

                const email =
                    emailInput.value.trim();

                if (!email) {

                    alert(
                        "Enter your email address."
                    );

                    return;
                }

                const submitButton =
                    forgotPasswordForm.querySelector(
                        'button[type="submit"]'
                    );

                try {

                    if (submitButton) {
                        submitButton.disabled = true;
                    }

                    const resetUrl =
                        new URL(
                            "reset-password.html",
                            window.location.href
                        ).href;

                    const {
                        error
                    } = await supabaseClient.auth
                        .resetPasswordForEmail(email, {
                            redirectTo: resetUrl
                        });

                    if (error) {

                        alert(
                            "PASSWORD RESET ERROR: " +
                            error.message
                        );

                        console.error(
                            "Password reset error:",
                            error
                        );

                        return;
                    }

                    alert(
                        "If the address is registered, a password-reset email will be sent. Check your inbox."
                    );

                } catch (error) {

                    console.error(
                        "Unexpected password reset error:",
                        error
                    );

                    alert(
                        "Unable to request a password reset. Please try again."
                    );

                } finally {

                    if (submitButton) {
                        submitButton.disabled = false;
                    }

                }

            }
        );

    }

}


// ========================================
// 9. RESET PASSWORD
// ========================================

if (currentPage === "reset-password.html") {

    const resetForm =
        document.querySelector(
            "#reset-password-form, .reset-password-form"
        );

    if (resetForm) {

        resetForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                if (!supabaseClient) {

                    alert(
                        "Connection error. Please try again."
                    );

                    return;
                }

                const passwordInput =
                    resetForm.querySelector("#password");

                const confirmPasswordInput =
                    resetForm.querySelector("#confirm-password");

                if (
                    !passwordInput ||
                    !confirmPasswordInput
                ) {

                    alert(
                        "The password fields could not be found."
                    );

                    return;
                }

                const password =
                    passwordInput.value;

                const confirmPassword =
                    confirmPasswordInput.value;

                if (password.length < 6) {

                    alert(
                        "Your password must contain at least 6 characters."
                    );

                    return;
                }

                if (password !== confirmPassword) {

                    alert(
                        "Your passwords do not match."
                    );

                    return;
                }

                const submitButton =
                    resetForm.querySelector(
                        'button[type="submit"]'
                    );

                try {

                    if (submitButton) {
                        submitButton.disabled = true;
                    }

                    const {
                        data: {
                            session
                        },
                        error: sessionError
                    } = await supabaseClient.auth.getSession();

                    if (sessionError || !session) {

                        alert(
                            "Your reset link may have expired. Request a new password-reset email."
                        );

                        return;
                    }

                    const {
                        error
                    } = await supabaseClient.auth.updateUser({
                        password: password
                    });

                    if (error) {

                        alert(
                            "PASSWORD UPDATE ERROR: " +
                            error.message
                        );

                        return;
                    }

                    alert(
                        "Your password has been updated. You can now sign in."
                    );

                    await supabaseClient.auth.signOut();

                    window.location.replace("login.html");

                } catch (error) {

                    console.error(
                        "Unexpected password update error:",
                        error
                    );

                    alert(
                        "Unable to update your password. Please try again."
                    );

                } finally {

                    if (submitButton) {
                        submitButton.disabled = false;
                    }

                }

            }
        );

    }

}


// ========================================
// 10. AUTHENTICATION STATE LOGGING
// ========================================

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        function (event) {

            console.log(
                "Maison authentication event:",
                event
            );

        }
    );

}
