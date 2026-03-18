(function () {

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render(clientes) {
    const tbody = document.getElementById('lista-clientes');
    const emptyEl = document.getElementById('control-clientes-empty');
    const tableWrap = document.getElementById('control-clientes-table-wrap');

    if (!tbody) return;

    if (!clientes || clientes.length === 0) {
      emptyEl.style.display = 'block';
      tableWrap.style.display = 'none';
      tbody.innerHTML = '';
      return;
    }

    emptyEl.style.display = 'none';
    tableWrap.style.display = 'block';
    tbody.innerHTML = '';

    clientes.forEach(c => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.rol_id)}</td>
        <td>
          <button class="btn btn--secondary">Ver token</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  async function cargarClientes() {
    try {
      const res = await fetch("https://talentouniversitarioapi.onrender.com/admin/clientes", {
        headers: {
          "Authorization": "Bearer ADMIN_SECRET"
        }
      });

      const data = await res.json();

      if (res.ok) {
        render(data);
      } else {
        console.error("Error:", data);
      }

    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }

  window.initControlClientes = function () {
    cargarClientes();
  };

})();