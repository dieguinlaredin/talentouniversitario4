console.log("JS cargado");

document.addEventListener("submit", async (e) => {

  if (e.target.id !== "form-registro-clientes") return;

  e.preventDefault(); // 🔥 ESTO ES LO QUE TE FALTA EN TIEMPO REAL

  console.log("Interceptando formulario");

  const email = document.getElementById("registro-cliente-correo").value;
  const password = document.getElementById("registro-cliente-contrasena").value;
  const mensaje = document.getElementById("registro-clientes-mensaje");

  try {
    const res = await fetch("https://talentouniversitarioapi.onrender.com/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ADMIN_SECRET"
      },
      body: JSON.stringify({
        email: email,
        passwd: password
      })
    });

    const data = await res.json();

    console.log("Respuesta:", data);

    if (res.ok) {
      mensaje.style.display = "block";
      mensaje.style.color = "green";
      mensaje.innerHTML = `
        Cliente creado<br><br>
        <textarea rows="4" style="width:100%">${data.token}</textarea>
      `;
    } else {
      mensaje.style.display = "block";
      mensaje.style.color = "red";
      mensaje.textContent = "Error: " + data.error;
    }

  } catch (error) {
    console.error(error);
    mensaje.style.display = "block";
    mensaje.style.color = "red";
    mensaje.textContent = "Error de conexión";
  }

});