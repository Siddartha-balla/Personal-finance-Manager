const API_URL =
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000/api"
        : "https://personal-finance-api-a316.onrender.com/api";
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        message.textContent = data.message;

        if (data.success) {

            // Store JWT for future API requests
            localStorage.setItem("token", data.token);

            // Store basic user information
            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }

    } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Unable to connect to server";
    }
});
