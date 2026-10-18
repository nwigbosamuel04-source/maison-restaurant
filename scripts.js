// =========================
// SUPABASE CONNECTION
// =========================

const supabaseUrl =
    "https://gfbqyenjnuyiczxnelcb.supabase.co";

    const supabaseKey =
"sb_publishable_mkaqGJ06GsRgVkxYbqK8rw_jzuWvzBT";

console.log("Supabase library:", window.supabase);

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Maison Supabase connected");


// =========================
// RESERVATION FORM
// =========================

const reservationForm =
    document.querySelector(".reservation-form");

if (reservationForm) {

    reservationForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.querySelector("#name").value.trim();

        const email =
            document.querySelector("#email").value.trim();

        const date =
            document.querySelector("#date").value;

        const time =
            document.querySelector("#time").value;

        const guests =
            document.querySelector("#guests").value;

        const request =
            document.querySelector("#message").value.trim();

        if (!name || !email || !date || !time || !guests) {
            alert("Please complete the required fields.");
            return;
        }

        const message =
            "Hello Maison! I would like to make a reservation.%0A%0A" +
            "Name: " + encodeURIComponent(name) + "%0A" +
            "Email: " + encodeURIComponent(email) + "%0A" +
            "Date: " + encodeURIComponent(date) + "%0A" +
            "Time: " + encodeURIComponent(time) + "%0A" +
            "Guests: " + encodeURIComponent(guests) + "%0A" +
            "Special Request: " +
            encodeURIComponent(request || "None");

        const whatsappNumber = "2347049642866";

        window.open(
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            message,
            "_blank"
        );

    });

}


// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

    });

}


// =========================
// PASSWORD VISIBILITY
// =========================

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

    // =========================
    // NORMAL LOGIN
    // =========================

    if (passwordInput) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const email =
                    loginForm
                        .querySelector("#email")
                        .value
                        .trim();

                const password =
                    passwordInput.value;

                if (!email || !password) {
                    alert("Please enter your email and password.");
                    return;
                }

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) {

                    alert(
                        "LOGIN ERROR: " +
                        error.message
                    );

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    return;
                }

                console.log("Login successful:", data);

                alert("Login successful.");

                window.location.href = "index.html";

            }
        );

    }


    // =========================
    // FORGOT PASSWORD
    // =========================

    else {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const email =
                    loginForm
                        .querySelector("#email")
                        .value
                        .trim();

                if (!email) {

                    alert(
                        "Please enter your email address."
                    );

                    return;
                }

                const resetUrl =
                    window.location.origin +
                    "/Restaurant-Website/reset-password.html";

                console.log(
                    "Password reset URL:",
                    resetUrl
                );

                const { error } =
                    await supabaseClient.auth.resetPasswordForEmail(
                        email,
                        {
                            redirectTo: resetUrl
                        }
                    );

                if (error) {

                    alert(
                        "SUPABASE ERROR: " +
                        error.message
                    );

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    return;
                }

                alert(
                    "Reset link sent successfully to " +
                    email
                );

            }
        );

    }




// =========================
// RESET PASSWORD
// =========================

const resetPasswordForm =
    document.querySelector(".reset-password-form");

if (resetPasswordForm) {

    let recoverySessionReady = false;


    // Listen for the recovery session
    supabaseClient.auth.onAuthStateChange(
        function (event, session) {

            console.log(
                "AUTH EVENT:",
                event
            );

            if (
                event === "PASSWORD_RECOVERY" &&
                session
            ) {

                recoverySessionReady = true;

                console.log(
                    "Password recovery session ready."
                );

            }

        }
    );


    resetPasswordForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const newPassword =
                document
                    .querySelector("#new-password")
                    .value;

            const confirmPassword =
                document
                    .querySelector("#confirm-password")
                    .value;


            if (newPassword !== confirmPassword) {

                alert("Passwords do not match.");
                return;

            }


            if (newPassword.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;

            }


            const {
                data: sessionData
            } =
                await supabaseClient.auth.getSession();


            if (
                !sessionData ||
                !sessionData.session
            ) {

                alert(
                    "Auth session is missing. " +
                    "Please open the newest reset link from your email again."
                );

                return;

            }


            const { error } =
                await supabaseClient.auth.updateUser({
                    password: newPassword
                });


            if (error) {

                alert(
                    "PASSWORD RESET ERROR: " +
                    error.message
                );

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );

                return;

            }


            alert(
                "Password updated successfully."
            );

            window.location.href =
                "login.html";

        }
    );

}


// =========================
// SIGN UP
// =========================

const signupForm =
    document.querySelector(".signup-form");

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                signupForm
                    .querySelector("#email")
                    .value
                    .trim();

            const password =
                signupForm
                    .querySelector("#password")
                    .value;

            const confirmPassword =
                signupForm
                    .querySelector("#confirm-password")
                    .value;


            if (password !== confirmPassword) {

                alert("Passwords do not match.");
                return;

            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;

            }


            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });


            if (error) {

                alert(
                    "SUPABASE ERROR: " +
                    error.message
                );

                console.error(
                    "SUPABASE ERROR:",
                    error
                );

                return;

            }


            console.log(
                "Signup successful:",
                data
            );


            alert(
                "Account created successfully."
            );


            window.location.href =
                "index.html";

        }
    );

}


// =========================
// HOMEPAGE LOGIN CHECK
// =========================

const currentPath =
    window.location.pathname;

const isHomepage =
    currentPath.endsWith("/index.html") ||
    currentPath === "/" ||
    currentPath === "";


if (isHomepage) {

    supabaseClient.auth.getSession().then(
        function ({ data, error }) {

            if (error) {

                console.error(
                    "SESSION ERROR:",
                    error
                );

                return;
            }


            if (!data.session) {

                window.location.href =
                    "login.html";

            }

        }
    );

}
