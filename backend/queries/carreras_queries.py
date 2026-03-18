from ..database.connection import get_connection


def obtener_carreras_por_institucion(institucion_id: int) -> list:
    connection = get_connection()
    if not connection:
        return []
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                carrera_id,
                nombre,
                nivel
            FROM carreras
            WHERE institucion_id = %s
            ORDER BY carrera_id ASC
            """,
            (institucion_id,)
        )
        return cursor.fetchall()
    except Exception as ex:
        print(f'Error al obtener carreras: {ex}')
        return []
    finally:
        cursor.close()
        connection.close()


def guardar_carrera(datos: dict) -> bool:
    connection = get_connection()
    if not connection:
        return False
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO carreras (nombre, nivel, institucion_id)
            VALUES (%s, %s, %s)
            """,
            (
                datos.get('nombre'),
                datos.get('nivel'),
                datos.get('institucion_id'),
            )
        )
        connection.commit()
        return True
    except Exception as ex:
        connection.rollback()
        print(f'Error al guardar carrera: {ex}')
        return False
    finally:
        cursor.close()
        connection.close()


def actualizar_carrera(carrera_id: int, datos: dict) -> bool:
    connection = get_connection()
    if not connection:
        return False
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE carreras
            SET nombre = %s, nivel = %s
            WHERE carrera_id = %s
            """,
            (
                datos.get('nombre'),
                datos.get('nivel'),
                carrera_id,
            )
        )
        connection.commit()
        return True
    except Exception as ex:
        connection.rollback()
        print(f'Error al actualizar carrera: {ex}')
        return False
    finally:
        cursor.close()
        connection.close()


def eliminar_carrera(carrera_id: int) -> bool:
    connection = get_connection()
    if not connection:
        return False
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            DELETE FROM carreras WHERE carrera_id = %s
            """,
            (carrera_id,)
        )
        connection.commit()
        return True
    except Exception as ex:
        connection.rollback()
        print(f'Error al eliminar carrera: {ex}')
        return False
    finally:
        cursor.close()
        connection.close()