const API_URL =
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000/api"
        : "https://personal-finance-api-a316.onrender.com/api";
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        message.textContent = data.message;

        if (data.success) {
            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        }

    } catch (error) {
        console.error("Registration error:", error);
        message.textContent = "Unable to connect to server";
    }
});