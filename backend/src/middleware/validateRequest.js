// /middleware/validateRequest.js

export default function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // para que devuelva todos los errores, no solo el primero
      allowUnknown: false, // si quieres rechazar campos que no están en el esquema
      stripUnknown: true // elimina automáticamente campos no definidos en el schema
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Datos inválidos.",
        details: error.details.map((detail) => detail.message)
      });
    }

    // Si todo está bien, seguimos
    next();
  };
}
