const form = document.getElementById("login-form");

if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (email && password) {
      const loginData = {
        email: email.value,
        password: password.value
      };

      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "index.html";
        } else {
          document.getElementById("error-message").textContent = "E-mail ou mot de passe incorrect.";
        }
      })
      .catch(error => {
        console.error("Erreur:", error);
        document.getElementById("error-message").textContent = "Une erreur s'est produite. Veuillez réessayer.";
      });
    }
  });
}
