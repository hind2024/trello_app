import Joi from "joi"

export const signUpSchema = Joi.object({
    userName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required(),
    cPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Repeat password must match password',
    }),
    age: Joi.number().integer().min(5).max(120).required(),
    gender: Joi.string().valid("male", "female").trim().required(),
    phone: Joi.string().length(11).required()
})


export const signInSchema = Joi.object({
    email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required()
})

export const verifyEmailSchema = Joi.object({
    token: Joi.string().pattern(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/).required()
})

export const sendCodeSchema = Joi.object({
    email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
})

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required(),
    password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required(),
    cPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Repeat password must match password',
    }),
    code: Joi.number().integer().min(100000).max(999999).required().messages({
        'number.base': 'Code should be a valid number.',
        'number.integer': 'Code must be an integer.',
        'number.min': 'Code must be at least 6 digits long.',
        'number.max': 'Code cannot exceed 6 digits.',
        'any.required': 'Code is a required field.',
    }),
})


export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required(),
    newPassword: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required(),
    cPassword: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{7,}$/).required()
})


export const updateUserSchema = Joi.object({
    userName: Joi.string().min(2).max(100).required(),
    age: Joi.number().integer().min(5).max(120).required(),
    gender: Joi.string().valid("male", "female").trim().required(),
    phone: Joi.string().length(11).required()
})

export const deleteUserSchema = Joi.object({
    userId: Joi.string().hex().length(24).required().trim()
})

export const softDeleteUserSchema = Joi.object({
    userId: Joi.string().hex().length(24).required().trim()
})

export const logoutSchema = Joi.object({
    userId: Joi.string().hex().length(24).required().trim()
})

