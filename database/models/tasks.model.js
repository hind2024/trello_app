import { Schema, model } from "mongoose";


const taskSchema = new Schema({
    title: {
        type: String,
        allowNull: false,
        required: true,
        unique: true
    },
    description: {
        type: String,
        allowNull: false,
        required: true
    },
    status: {
        type: String,
        allowNull: false,
        required: true,
        select: ['toDo', 'doing', 'done'],
        default: 'toDo',
    },
    userId: {
        type: Schema.Types.ObjectId,
        allowNull: false,
        required: true,
        ref: 'users'
    },
    assignTo: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        allowNull: false,
        required: true
    },
    deadline: {
        type: Date,
        allowNull: false,
        required: true
    },
    attachments: String

}, {
    timestamps: true,
})

const taskModel = model('tasks', taskSchema)

export default taskModel