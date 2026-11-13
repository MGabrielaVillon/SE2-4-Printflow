/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       properties:
 *         id_notificacion:
 *           type: integer
 *           description: ID único de la notificación
 *         lote_id:
 *           type: integer
 *           nullable: true
 *           description: ID del lote asociado
 *         tipo_notificacion_id:
 *           type: integer
 *           description: ID del tipo de notificación
 *         titulo:
 *           type: string
 *           description: Título de la notificación
 *         mensaje:
 *           type: string
 *           description: Cuerpo del mensaje
 *         leida:
 *           type: boolean
 *           description: Estado de lectura
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 *         fecha_lectura:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         tipo_nombre:
 *           type: string
 *         codigo_lote:
 *           type: string
 *         total_registros:
 *           type: integer
 *         periodo:
 *           type: string
 */

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener todas las notificaciones
 *     tags: [Notificaciones]
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notificacion'
 *   post:
 *     summary: Crear una nueva notificación
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, mensaje]
 *             properties:
 *               titulo:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               lote_id:
 *                 type: integer
 *               tipo_codigo:
 *                 type: string
 *                 default: LOTE_PENDIENTE
 *     responses:
 *       201:
 *         description: Notificación creada
 */

/**
 * @swagger
 * /api/notificaciones/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de notificaciones
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *         description: Filtrar por usuario (opcional)
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 */

/**
 * @swagger
 * /api/notificaciones/no-leidas:
 *   get:
 *     summary: Obtener notificaciones no leídas
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas
 */

/**
 * @swagger
 * /api/notificaciones/leidas:
 *   get:
 *     summary: Obtener notificaciones leídas
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones leídas
 */

/**
 * @swagger
 * /api/notificaciones/contar-no-leidas:
 *   get:
 *     summary: Contar notificaciones no leídas
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Total de notificaciones no leídas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total_no_leidas:
 *                   type: integer
 */

/**
 * @swagger
 * /api/notificaciones/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener notificaciones de un usuario
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */

/**
 * @swagger
 * /api/notificaciones/lote/{loteId}:
 *   get:
 *     summary: Obtener notificaciones de un lote
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: loteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 */

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   get:
 *     summary: Obtener notificación por ID
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la notificación
 *       404:
 *         description: Notificación no encontrada
 */

/**
 * @swagger
 * /api/notificaciones/{id}/marcar-leida:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 */

/**
 * @swagger
 * /api/notificaciones/marcar-varias:
 *   patch:
 *     summary: Marcar varias notificaciones como leídas
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Notificaciones marcadas
 */

/**
 * @swagger
 * /api/notificaciones/marcar-todas:
 *   patch:
 *     summary: Marcar todas las notificaciones como leídas
 *     tags: [Notificaciones]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Todas las notificaciones marcadas
 */

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar una notificación
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación eliminada
 */

/**
 * @swagger
 * /api/notificaciones/limpiar/antiguas:
 *   delete:
 *     summary: Eliminar notificaciones antiguas
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Días de antigüedad
 *     responses:
 *       200:
 *         description: Notificaciones eliminadas
 */

/**
 * @swagger
 * /api/notificaciones/{id}/aprobar:
 *   post:
 *     summary: Aprobar lote asociado a notificación
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id]
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario que aprueba
 *     responses:
 *       200:
 *         description: Lote aprobado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Error de validación o usuario no proporcionado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/notificaciones/{id}/rechazar:
 *   post:
 *     summary: Rechazar lote asociado a notificación
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario_id]
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario que rechaza
 *               motivo:
 *                 type: string
 *                 description: Motivo del rechazo
 *     responses:
 *       200:
 *         description: Lote rechazado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
