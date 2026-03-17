window.initVistaDatos = function () {
  var btnCargar = document.getElementById('btn-cargar-datos');
  var jsonOutput = document.getElementById('json-output');

  if (btnCargar) {
    btnCargar.addEventListener('click', function () {
      fetch('/api/datos-json')
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Error al cargar datos');
          }
          return response.json();
        })
        .then(function(data) {
          if (jsonOutput) {
            jsonOutput.textContent = JSON.stringify(data, null, 2);
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
          if (jsonOutput) {
            jsonOutput.textContent = 'Error al cargar datos: ' + error.message;
          }
        });
    });
  }
};