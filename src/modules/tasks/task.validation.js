import Joi from 'joi'



export const addTaskSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    status: Joi.string().trim().required().valid('toDo', 'doing', 'done').default('toDo'),
    assignTo: Joi.string().hex().length(24).trim().required(),
    deadline: Joi.date().required(),
})


export const updateTaskSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    status: Joi.string().trim().required().valid('toDo', 'doing', 'done').default('toDo'),
    assignTo: Joi.string().hex().length(24).trim().required(),
    taskId: Joi.string().hex().length(24).trim().required(),

})


export const deleteTaskSchema = Joi.object({
    taskId: Joi.string().hex().length(24).trim().required(),
})


export const creatorTasksSchema = Joi.object({
    taskId: Joi.string().hex().length(24).trim().required(),
})

export const add_attchmentsSchema = Joi.object({
    id: Joi.string().hex().length(24).trim().required(),
})



// export const taskSchema = Joi.object({
//     title: Joi.string().trim().required(),
//     description: Joi.string().trim().required(),
//     status: Joi.string().trim().required().allow(['toDo', 'doing', 'done']).default('toDo'),
//     userId: Joi.string().hex().length(24).trim().required(),
//     assignTo: Joi.string().hex().length(24).trim().required(),
//     deadline: Joi.date().required(),
//     attachments: Joi.string(),

// })


