const mapa = {
  'nombre, instructor, fecha_inicio y fecha_fin son obligatorios': 'Completa todos los campos obligatorios del taller',
  'nombre debe ser un texto no vacío': 'El nombre del taller no puede estar vacío',
  'fecha_inicio debe tener formato YYYY-MM-DD': 'La fecha de inicio no tiene un formato válido',
  'fecha_fin debe tener formato YYYY-MM-DD': 'La fecha de término no tiene un formato válido',
  'La fecha de inicio no puede ser anterior a hoy': 'La fecha de inicio no puede ser anterior a hoy',
  'La fecha de inicio no puede ser más allá de 2026': 'La fecha de inicio no puede ser más allá de 2026',
  'La fecha de fin no puede ser anterior a la fecha de inicio': 'La fecha de término no puede ser anterior a la fecha de inicio',
  'La fecha de fin no puede ser más allá de 2026': 'La fecha de término no puede ser más allá de 2026',
  'capacidad_maxima debe ser un número entero positivo': 'La capacidad máxima debe ser un número entero positivo',
  'hora_inicio y hora_fin deben enviarse juntos': 'Debes ingresar hora de inicio y hora de término',
  'precio debe ser un número positivo': 'El precio debe ser un número positivo',
  'Taller no encontrado': 'El taller no existe o fue eliminado',
  'No se puede eliminar un taller con inscripciones activas. Cámbialo a estado "cancelado" en su lugar.': 'No puedes eliminar un taller con alumnos inscritos. Cámbialo a "Cancelado"',

  'taller_id, nombre_alumno y email_alumno son obligatorios': 'Completa todos los campos de inscripción',
  'El taller no está disponible para inscripciones': 'Este taller no está disponible para inscripciones',
  'Ya estás inscrito en este taller': 'Ya te inscribiste anteriormente a este taller',
  'Ya tienes una inscripción en un taller con horario solapado': 'Ya tienes un taller en ese mismo horario, revisa tus inscripciones',
  'El taller ha alcanzado su capacidad máxima': 'Este taller ya no tiene cupos disponibles',
  'Inscripción no encontrada o ya cancelada': 'Esta inscripción no existe o ya fue cancelada',

  'Nombre, email y contraseña son obligatorios': 'Completa todos los campos de registro',
  'La contraseña debe tener al menos 6 caracteres': 'La contraseña debe tener al menos 6 caracteres',
  'El email ya está registrado': 'Este email ya tiene una cuenta registrada',
  'Email y contraseña son obligatorios': 'Ingresa tu email y contraseña',
  'Credenciales inválidas': 'Email o contraseña incorrectos',
  'El email es obligatorio': 'Ingresa tu correo electrónico',
  'Token y nueva contraseña son obligatorios': 'Completa todos los campos',
  'Token inválido o ya utilizado': 'Este enlace ya fue usado o no es válido',
  'El token ha expirado': 'El enlace de restablecimiento ya venció. Solicita uno nuevo',
  'instructor debe ser un texto no vacío': 'El instructor no puede estar vacío',
  'La hora de inicio no puede ser mayor a la hora de término': 'La hora de inicio no puede ser mayor a la hora de término',
  'La fecha de inicio no puede ser posterior a la fecha de término': 'La fecha de inicio no puede ser posterior a la fecha de término',
  'No puedes cancelar una inscripción a un taller que ya se realizó': 'No puedes cancelar una inscripción a un taller que ya se realizó',
  'La capacidad máxima no puede ser menor a la actual': 'La capacidad máxima no puede ser menor a la actual',
  'Acción permitida solo para administradores': 'Solo los administradores pueden realizar esta acción',
  'Token requerido': 'Debes iniciar sesión para continuar',
  'Token inválido o expirado': 'Tu sesión expiró. Inicia sesión nuevamente',

  'taller_id es obligatorio': 'Completa todos los campos',
  'El taller no está disponible': 'Este taller no está disponible',
  'El taller aún tiene cupos disponibles, puedes inscribirte directamente': 'Este taller tiene cupos disponibles, puedes inscribirte directamente',
  'Ya estás en la lista de espera de este taller': 'Ya estás en la lista de espera de este taller',
  'Solicitud no encontrada o ya procesada': 'Esta solicitud no existe o ya fue procesada',
};

export function mensajeError(err) {
  if (!err) return 'Ocurrió un error inesperado';

  const raw = err.response?.data?.error;
  const msg = (typeof raw === 'string' ? raw : null)
    || err.response?.data?.message
    || err.message
    || '';

  if (msg && mapa[msg]) return mapa[msg];

  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'No se pudo conectar con el servidor. Verifica tu conexión';
  }

  const status = err.response?.status;
  if (status === 400 || status === 422) return 'Revisa los datos ingresados e intenta de nuevo';
  if (status === 404) return 'El recurso solicitado no existe';
  if (status === 409) return 'Este recurso ya está ocupado o no está disponible';
  if (status === 500 || !status) return 'Algo salió mal. Intenta de nuevo más tarde';

  return msg || 'Ocurrió un error inesperado';
}
