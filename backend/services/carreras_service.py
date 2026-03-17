from ..queries.carreras_queries import (
    obtener_carreras_por_institucion,
    guardar_carrera,
    actualizar_carrera,
    eliminar_carrera
)


def listar_carreras_por_institucion_service(institucion_id: int) -> dict:
    carreras = obtener_carreras_por_institucion(institucion_id)
    return {
        'ok': True,
        'carreras': carreras,
    }


def registrar_carrera_service(datos: dict) -> dict:
    campos_requeridos = ['nombre', 'nivel', 'institucion_id']
    
    for campo in campos_requeridos:
        valor = datos.get(campo)
        if not valor or (isinstance(valor, str) and not valor.strip()):
            return {
                'ok': False,
                'mensaje': f'El campo "{campo}" es obligatorio.',
            }

    exito = guardar_carrera(datos)
    if not exito:
        return {
            'ok': False,
            'mensaje': 'Error al guardar la carrera en la base de datos.',
        }

    return {
        'ok': True,
        'mensaje': 'Carrera registrada correctamente.',
    }


def actualizar_carrera_service(carrera_id: int, datos: dict) -> dict:
    campos_requeridos = ['nombre', 'nivel']
    
    for campo in campos_requeridos:
        valor = datos.get(campo)
        if not valor or (isinstance(valor, str) and not valor.strip()):
            return {
                'ok': False,
                'mensaje': f'El campo "{campo}" es obligatorio.',
            }

    exito = actualizar_carrera(carrera_id, datos)
    if not exito:
        return {
            'ok': False,
            'mensaje': 'Error al actualizar la carrera.',
        }

    return {
        'ok': True,
        'mensaje': 'Carrera actualizada correctamente.',
    }


def eliminar_carrera_service(carrera_id: int) -> dict:
    exito = eliminar_carrera(carrera_id)
    if not exito:
        return {
            'ok': False,
            'mensaje': 'Error al eliminar la carrera.',
        }

    return {
        'ok': True,
        'mensaje': 'Carrera eliminada correctamente.',
    }