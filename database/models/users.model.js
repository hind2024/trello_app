import { Schema, model } from "mongoose";


const userSchema = new Schema({
    userName: {
        type: String,
        allowNull: false,
        required: true
    },
    email: {
        type: String,
        allowNull: false,
        unique: true,
        required: true
    },
    password: {
        type: String,
        allowNull: false,
        required: true
    },
    age: {
        type: Number,
        allowNull: false,
        required: true
    },
    gender: {
        type: String,
        allowNull: false,
        enum: ["male", "female"],
        required: true,
        default: "male"
    },
    phone: {
        type: String,
        allowNull: false,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    deleted: {
        type: Boolean,
        default: false,
        allowNull: false,
        required: true,
    },
    logout: {
        type: Boolean,
        default: false,
        allowNull: false,
        required: true,
    },
    emailConfirm: {
        type: Boolean,
        default: false
    },
    code: String,

    profilePic: String,
    
    coverPic: [String],

}, {
    timestamps: true,
})

const userModel = model('users', userSchema)

export default userModel