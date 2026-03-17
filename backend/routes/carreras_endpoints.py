from flask import Blueprint, request, jsonify
from ..services.carreras_service import (
    listar_carreras_por_institucion_service,
    registrar_carrera_service,
    actualizar_carrera_service,
    eliminar_carrera_service
)

carreras_bp = Blueprint('carreras', __name__)

# ─────────────────────────────────────────────
# Listar carreras por institución
# ─────────────────────────────────────────────

@carreras_bp.route('/api/carreras/<int:institucion_id>', methods=['GET'])
def listar_carreras(institucion_id):
    resultado = listar_carreras_por_institucion_service(institucion_id)
    return jsonify(resultado), 200

# ─────────────────────────────────────────────
# Registrar nueva carrera
# ─────────────────────────────────────────────

@carreras_bp.route('/api/carreras', methods=['POST'])
def registrar_carrera():
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({
            'ok': False,
            'mensaje': 'Cuerpo de la petición inválido o vacío.',
        }), 400

    datos_limpios = {k: v.strip() if isinstance(v, str) else v
                     for k, v in datos.items()}

    resultado = registrar_carrera_service(datos_limpios)
    status = 201 if resultado['ok'] else 400
    return jsonify(resultado), status

# ─────────────────────────────────────────────
# Actualizar carrera
# ─────────────────────────────────────────────

@carreras_bp.route('/api/carreras/<int:carrera_id>', methods=['PUT'])
def editar_carrera(carrera_id):
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({'ok': False, 'mensaje': 'Cuerpo inválido.'}), 400
    
    datos_limpios = {k: v.strip() if isinstance(v, str) else v
                     for k, v in datos.items()}

    resultado = actualizar_carrera_service(carrera_id, datos_limpios)
    status = 200 if resultado['ok'] else 400
    return jsonify(resultado), status

# ─────────────────────────────────────────────
# Eliminar carrera
# ─────────────────────────────────────────────

@carreras_bp.route('/api/carreras/<int:carrera_id>', methods=['DELETE'])
def eliminar_carrera(carrera_id):
    resultado = eliminar_carrera_service(carrera_id)
    status = 200 if resultado['ok'] else 400
    return jsonify(resultado), status