async function obtenerDatos(token) {
  if (!token) {
    console.error("No hay token");
    return;
  }

  try {
    const res = await fetch("https://talentouniversitarioapi.onrender.com/api/datos-json", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}