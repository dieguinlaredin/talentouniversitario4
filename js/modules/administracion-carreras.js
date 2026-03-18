/**
 * Administración de carreras - Por institución.
 * Guarda carreras en la base de datos relacionadas con la institución seleccionada.
 */

function getInstitucionSeleccionada() {
  var select = document.getElementById('admin-carreras-institucion');
  if (!select || !select.value) return null;
  var list = window.__adminInstituciones || [];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i].institucion_id) === String(select.value)) return list[i];
  }
  return null;
}

function loadCarreras(institucion_id) {
  fetch('/api/carreras/' + institucion_id)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Error al cargar carreras');
      }
      return response.json();
    })
    .then(function(data) {
      if (data.ok && data.carreras) {
        var inst = getInstitucionSeleccionada();
        if (inst) {
          inst.carreras = data.carreras;
          renderCarreras();
        }
      } else {
        console.error('Error en la respuesta:', data);
      }
    })
    .catch(function(error) {
      console.error('Error al cargar carreras:', error);
    });
}

function escapeHtml(str) {
  if (str == null) return '';
  var s = String(str);
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderCarreras() {
  var inst = getInstitucionSeleccionada();
  var content = document.getElementById('admin-carreras-content');
  var emptyEl = document.getElementById('admin-carreras-empty');
  var tableWrap = document.getElementById('admin-carreras-table-wrap');
  var tbody = document.getElementById('admin-carreras-lista');
  var titulo = document.getElementById('admin-carreras-institucion-nombre');

  if (!content || !tbody) return;

  if (!inst) {
    content.style.display = 'none';
    return;
  }

  content.style.display = 'block';
  if (titulo) titulo.textContent = inst.nombreInstitucion || 'Institución';
  inst.carreras = inst.carreras || [];
  var carreras = inst.carreras;

  if (carreras.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (tableWrap) tableWrap.style.display = 'none';
    tbody.innerHTML = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (tableWrap) tableWrap.style.display = 'block';
  tbody.innerHTML = '';

  for (var i = 0; i < carreras.length; i++) {
    var c = carreras[i];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + escapeHtml(c.nombre) + '</td>' +
      '<td>' + escapeHtml(c.nivel || '') + '</td>' +
      '<td><div class="control-instituciones__actions">' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-editar-carrera" data-id="' + escapeHtml(c.carrera_id) + '">Editar</button> ' +
      '<button type="button" class="btn btn--secondary control-instituciones__btn btn-eliminar-carrera" data-id="' + escapeHtml(c.carrera_id) + '">Eliminar</button>' +
      '</div></td>';
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll('.btn-editar-carrera').forEach(function (btn) {
    btn.addEventListener('click', function () {
      abrirModalCarrera(btn.getAttribute('data-id'), true);
    });
  });
  tbody.querySelectorAll('.btn-eliminar-carrera').forEach(function (btn) {
    btn.addEventListener('click', function () {
      eliminarCarrera(btn.getAttribute('data-id'));
    });
  });
}

function abrirModalCarrera(carreraId, esEditar) {
  var modal = document.getElementById('modal-carrera');
  var title = document.getElementById('modal-carrera-title');
  var form = document.getElementById('form-carrera');
  var idInput = document.getElementById('carrera-id-edit');
  var nombreInput = document.getElementById('carrera-nombre');
  var nivelSelect = document.getElementById('carrera-nivel');
  if (!modal || !form || !nombreInput) return;

  idInput.value = esEditar ? (carreraId || '') : '';
  title.textContent = esEditar ? 'Editar carrera' : 'Agregar carrera';
  nombreInput.value = '';
  if (nivelSelect) nivelSelect.value = '';

  if (esEditar && carreraId) {
    var inst = getInstitucionSeleccionada();
    if (inst && inst.carreras) {
      for (var i = 0; i < inst.carreras.length; i++) {
        if (String(inst.carreras[i].carrera_id) === String(carreraId)) {
          nombreInput.value = inst.carreras[i].nombre || '';
          if (nivelSelect) nivelSelect.value = inst.carreras[i].nivel || '';
          break;
        }
      }
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarModalCarrera() {
  var modal = document.getElementById('modal-carrera');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function eliminarCarrera(carreraId) {
  window.carreraAEliminar = carreraId;
  abrirModalConfirmar();
}

function abrirModalConfirmar() {
  var modal = document.getElementById('modal-confirmar-eliminar');
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarModalConfirmar() {
  var modal = document.getElementById('modal-confirmar-eliminar');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

window.initAdministracionCarreras = function () {
  var selectInst = document.getElementById('admin-carreras-institucion');
  var btnAgregar = document.getElementById('admin-carreras-btn-agregar');

  if (!selectInst) return;

  // Cargar instituciones desde el backend
  fetch('/api/instituciones')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Error al cargar instituciones');
      }
      return response.json();
    })
    .then(function(data) {
      if (data.ok && data.instituciones) {
        window.__adminInstituciones = data.instituciones;
        // Poblar el select
        selectInst.innerHTML = '<option value="">Selecciona una institución</option>';
        for (var i = 0; i < data.instituciones.length; i++) {
          var inst = data.instituciones[i];
          inst.carreras = inst.carreras || [];
          var opt = document.createElement('option');
          opt.value = inst.institucion_id || '';
          opt.textContent = inst.nombreInstitucion || 'Sin nombre';
          selectInst.appendChild(opt);
        }
      } else {
        console.error('Error en la respuesta:', data);
        selectInst.innerHTML = '<option value="">Error al cargar instituciones</option>';
      }
    })
    .catch(function(error) {
      console.error('Error al hacer fetch:', error);
      selectInst.innerHTML = '<option value="">Error al cargar instituciones</option>';
    });

  selectInst.addEventListener('change', function () {
    var inst = getInstitucionSeleccionada();
    if (inst) {
      loadCarreras(inst.institucion_id);
    } else {
      renderCarreras();
    }
  });

  if (btnAgregar) {
    btnAgregar.onclick = function () {
      if (!getInstitucionSeleccionada()) {
        alert('Selecciona primero una institución.');
        return;
      }
      abrirModalCarrera(null, false);
    };
  }

  var modal = document.getElementById('modal-carrera');
  var form = document.getElementById('form-carrera');
  var btnCerrar = document.getElementById('modal-carrera-close');
  var btnCancelar = document.getElementById('modal-carrera-cancelar');
  var backdrop = document.getElementById('modal-carrera-backdrop');

  function closeModal() {
    cerrarModalCarrera();
  }
  if (btnCerrar) btnCerrar.addEventListener('click', closeModal);
  if (btnCancelar) btnCancelar.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inst = getInstitucionSeleccionada();
      if (!inst) return;
      var idInput = document.getElementById('carrera-id-edit');
      var nombreInput = document.getElementById('carrera-nombre');
      var nivelSelect = document.getElementById('carrera-nivel');
      var nombre = (nombreInput && nombreInput.value) ? nombreInput.value.trim() : '';
      var nivel = (nivelSelect && nivelSelect.value) ? nivelSelect.value : '';
      if (!nombre) {
        alert('Escribe el nombre de la carrera.');
        return;
      }
      if (!nivel) {
        alert('Selecciona el nivel.');
        return;
      }
      var idEdit = idInput && idInput.value;
      var url = '/api/carreras';
      var method = 'POST';
      var body = {
        nombre: nombre,
        nivel: nivel,
        institucion_id: inst.institucion_id
      };
      if (idEdit) {
        url += '/' + idEdit;
        method = 'PUT';
        delete body.institucion_id; // No se necesita para update
      }
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.ok) {
          cerrarModalCarrera();
          loadCarreras(inst.institucion_id); // Recargar carreras
        } else {
          alert('Error: ' + (data.mensaje || 'Error desconocido'));
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
        alert('Error al guardar la carrera.');
      });
    });
  }

  // Modal confirmar eliminación
  var modalConfirmar = document.getElementById('modal-confirmar-eliminar');
  var btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
  var btnConfirmarCancelar = document.getElementById('modal-confirmar-cancelar');
  var backdropConfirmar = document.getElementById('modal-confirmar-backdrop');

  function closeConfirmModal() {
    cerrarModalConfirmar();
  }
  if (btnConfirmarCancelar) btnConfirmarCancelar.addEventListener('click', closeConfirmModal);
  if (backdropConfirmar) backdropConfirmar.addEventListener('click', closeConfirmModal);

  if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener('click', function () {
      var carreraId = window.carreraAEliminar;
      if (!carreraId) return;
      var inst = getInstitucionSeleccionada();
      if (!inst) return;
      fetch('/api/carreras/' + carreraId, {
        method: 'DELETE'
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.ok) {
          cerrarModalConfirmar();
          loadCarreras(inst.institucion_id); // Recargar carreras
        } else {
          alert('Error: ' + (data.mensaje || 'Error desconocido'));
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
        alert('Error al eliminar la carrera.');
      });
    });
  }

  renderCarreras();
};
