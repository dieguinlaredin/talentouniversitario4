from flask import Blueprint, jsonify
from ..queries.datos_queries import obtener_datos_completos

datos_bp = Blueprint('datos', __name__)

@datos_bp.route('/api/registro-estudiantes', methods=['GET'])
def obtener_datos_json():
    datos = obtener_datos_completos()
    return jsonify(datos), 200