(function () {

  function escapeHtml(value) {
    if (value == null) return '-';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderCards(estudiantes) {
    var grid = document.getElementById('control-estudiantes-grid');
    var empty = document.getElementById('control-estudiantes-empty');
    if (!grid || !empty) return;

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      empty.style.display = 'block';
      grid.innerHTML = '';
      return;
    }

    empty.style.display = 'none';

    grid.innerHTML = estudiantes.map(function (estudiante) {
      var nombre = escapeHtml(estudiante.nombre);
      var institucion = escapeHtml(estudiante.institucion);
      var cct = escapeHtml(estudiante.cct);
      var ciudad = escapeHtml(estudiante.ciudad);
      var estado = escapeHtml(estudiante.estado);
      var carrera = escapeHtml(estudiante.carrera);
      var nivel = escapeHtml(estudiante.nivel);
      var promedio = estudiante.promedio != null ? escapeHtml(estudiante.promedio) : '-';
      var periodoTipo = escapeHtml(estudiante.tipo_periodo);
      var periodoNumero = escapeHtml(estudiante.periodo_numero);
      var disponibilidad = estudiante.disponibilidad ? 'Disponible' : 'No disponible';

      return (
        '<article class="control-estudiantes__card">' +
        '<header class="control-estudiantes__card-header">' +
        '<h3 class="control-estudiantes__name">' + nombre + '</h3>' +
        '<span class="control-estudiantes__status">Pendiente</span>' +
        '</header>' +

        '<dl class="control-estudiantes__details">' +
        '<div><dt>Institución</dt><dd>' + institucion + '</dd></div>' +
        '<div><dt>CCT</dt><dd>' + cct + '</dd></div>' +
        '<div><dt>Ciudad</dt><dd>' + ciudad + '</dd></div>' +
        '<div><dt>Estado</dt><dd>' + estado + '</dd></div>' +
        '<div><dt>Carrera</dt><dd>' + carrera + '</dd></div>' +
        '<div><dt>Nivel</dt><dd>' + nivel + '</dd></div>' +
        '<div><dt>Promedio</dt><dd>' + promedio + '</dd></div>' +
        '<div><dt>Periodo</dt><dd>' + periodoTipo + ' ' + periodoNumero + '</dd></div>' +
        '<div><dt>Disponibilidad</dt><dd>' + disponibilidad + '</dd></div>' +
        '</dl>' +

        '<div class="control-estudiantes__actions">' +
        '<button type="button" class="btn btn--primary control-estudiantes__approve" data-id="' + estudiante.alumno_id + '">' +
        'Aprobar' +
        '</button>' +
        '</div>' +
        '</article>'
      );
    }).join('');
  }

  function initApproveAction() {
    var grid = document.getElementById('control-estudiantes-grid');
    if (!grid) return;

    grid.addEventListener('click', async function (event) {
      var btn = event.target.closest('.control-estudiantes__approve');
      if (!btn) return;

      var id = btn.getAttribute('data-id');

      try {
        const res = await fetch(`https://talentouniversitarioapi.onrender.com/admin/aprobar-estudiante/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": "Bearer ADMIN_SECRET"
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "No se pudo aprobar");
        }

        btn.disabled = true;
        btn.textContent = 'Aprobado';
        btn.classList.remove('btn--primary');
        btn.classList.add('btn--secondary');

        const card = btn.closest('.control-estudiantes__card');
        const status = card?.querySelector('.control-estudiantes__status');

        if (status) {
          status.textContent = 'Aprobado';
          status.classList.add('is-approved');
        }

        setTimeout(() => {
          if (card) card.remove();
        }, 800);

      } catch (error) {
        console.error("Error al aprobar:", error);
        alert("No se pudo aprobar el estudiante");
      }
    });
  }

  async function loadEstudiantes() {
    try {
      const response = await fetch('https://talentouniversitarioapi.onrender.com/admin/pendientes', {
        method: "GET",
        headers: {
          "Authorization": "Bearer ADMIN_SECRET"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Error al cargar estudiantes");
      }

      renderCards(data.estudiantes || data);

    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      renderCards([]);
    }
  }

  window.initControlEstudiantes = function () {
    initApproveAction();
    loadEstudiantes();
  };

})();