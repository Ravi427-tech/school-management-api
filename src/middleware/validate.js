const Joi = require("joi");

/**
 * Validates the payload for POST /addSchool
 */
const validateAddSchool = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(255).required().messages({
      "string.empty": "School name cannot be empty.",
      "string.min": "School name must be at least 2 characters.",
      "string.max": "School name cannot exceed 255 characters.",
      "any.required": "School name is required.",
    }),

    address: Joi.string().trim().min(5).max(500).required().messages({
      "string.empty": "Address cannot be empty.",
      "string.min": "Address must be at least 5 characters.",
      "any.required": "Address is required.",
    }),

    latitude: Joi.number().min(-90).max(90).required().messages({
      "number.base": "Latitude must be a valid number.",
      "number.min": "Latitude must be between -90 and 90.",
      "number.max": "Latitude must be between -90 and 90.",
      "any.required": "Latitude is required.",
    }),

    longitude: Joi.number().min(-180).max(180).required().messages({
      "number.base": "Longitude must be a valid number.",
      "number.min": "Longitude must be between -180 and 180.",
      "number.max": "Longitude must be between -180 and 180.",
      "any.required": "Longitude is required.",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

/**
 * Validates the query parameters for GET /listSchools
 */
const validateListSchools = (req, res, next) => {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
      "number.base": "Latitude must be a valid number.",
      "number.min": "Latitude must be between -90 and 90.",
      "number.max": "Latitude must be between -90 and 90.",
      "any.required": "Latitude query parameter is required.",
    }),

    longitude: Joi.number().min(-180).max(180).required().messages({
      "number.base": "Longitude must be a valid number.",
      "number.min": "Longitude must be between -180 and 180.",
      "number.max": "Longitude must be between -180 and 180.",
      "any.required": "Longitude query parameter is required.",
    }),

    page: Joi.number().integer().min(1).optional().messages({
      "number.base": "Page must be a valid integer.",
      "number.min": "Page must be 1 or greater.",
    }),

    limit: Joi.number().integer().min(1).max(100).optional().messages({
      "number.base": "Limit must be a valid integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit cannot exceed 100.",
    }),
  });

  const { error } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

module.exports = { validateAddSchool, validateListSchools };
