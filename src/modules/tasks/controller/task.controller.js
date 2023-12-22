import taskModel from "../../../../database/models/tasks.model.js"
import userModel from '../../../../database/models/users.model.js'
import { AppError } from "../../../utils/AppError.js"
import { catchError } from "../../../utils/catchError.js"
import cloudinary from '../../../utils/cloudinary.js'

// 1-add task with status (toDo)(user must be logged in)
export const addTaskWithStatus = catchError(async (req, res, next) => {

    const { title, description, status, assignTo, deadline } = req.body

    const cheakAssignTo = await userModel.findById(assignTo)

    let task = await taskModel.findOne({ title })
    if (!task) {

        const userId = req.userId
        let user = await userModel.findById(userId)
        // console.log(user);

        if (user) {
            if (user.logout === true) {
                res.json({ message: "user is logout please sign in to add task " })

            } else if (user.deleted === true) {
                res.json({ message: "user doesn't exist cause it deleted before" })

            } else if (deadline < new Date().toISOString()) {
                res.json({ message: "invalid date please enter date after now" })


            } else if (!cheakAssignTo) {
                // console.log(!cheakAssignTo);
                res.json({ message: 'this user you want to assign this task not exist 🤔😑' })

            } else {
                let user = await taskModel.insertMany({ title, description, status, userId, assignTo, deadline })
                res.json({ message: "success", user })
            }

        } else {
            res.json({ message: "account not found" })

        }

    } else {
        res.json({ message: "task already exists" })

    }
})


// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = catchError(async (req, res, next) => {

    const { title, description, status, assignTo, taskId } = req.body

    const userId = req.userId

    const cheakAssignTo = await userModel.findById(assignTo)

    let cheakTitle = await taskModel.findOne({ title })

    const task = await taskModel.findById(taskId)
    // console.log(task);
    if (!task) {
        res.json({ message: "Task not found" });

    } else if (task.userId.toString() !== userId) {
        res.json({ message: "user Only the creator can update this task" });

    } else if (task.assignTo.logout == true) {
        res.json({ message: "user is logout please sign in to add task " })

    } else if (task.assignTo.deleted == true) {
        res.json({ message: "user doesn't exist cause it deleted before" })

    } else if (!cheakAssignTo) {
        // console.log(!cheakAssignTo);
        res.json({ message: 'this user you want to assign this task not exist 🤔😑' })



    } else if (cheakTitle) {
        res.json({ message: "task already exists" })

    } else {

        if (status == 'toDo' || status == 'doing' || status == 'done') {

            let taskUpdate = await taskModel.findByIdAndUpdate({ _id: taskId }, { title, description, status, assignTo }, { new: true })
            res.json({ message: "success", taskUpdate })
            // console.log(status);

        } else {
            res.json({ message: 'enter vaild status 😑' })

        }

    }
})


// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = catchError(async (req, res, next) => {
    const taskId = req.params.id

    const userId = req.userId

    let task = await taskModel.findById(taskId)

    if (!task) {
        res.json({ message: 'Task not found' })

    } else if (task.userId.toString() !== userId) {
        res.json({ message: 'user Only the creator can delete this task' })

    } else if (task.userId.logout == true) {
        res.json({ message: "user is logout please sign in to delete task " })

    } else {
        let taskDelete = await taskModel.findByIdAndDelete({ _id: taskId })
        res.json({ message: 'success', taskDelete })

    }
})


// 4-get all tasks with user data
export const allTasksWithUser = catchError(async (req, res, next) => {

    let tasks = await taskModel.find({}).populate('userId', 'userName email').populate('assignTo', 'userName email')

    if (tasks.length > 0) return res.json({ message: 'success', tasks })

    res.json({ message: 'tasks not found' })
})

// 4-get all tasks with creator tasks
export const creatorTasks = catchError(async (req, res, next) => {

    const userId = req.userId

    let tasks = await taskModel.find({ userId }).populate('userId', 'userName email').populate('assignTo', 'userName email')

    if (tasks.length > 0) return res.json({ message: 'success', tasks })

    res.json({ message: 'tasks not found' })
})

// 5-get tasks of oneUser with user data (user must be logged in)
export const allTasksWithOneUser_1 = catchError(async (req, res, next) => {

    const userId = req.userId

    let tasks = await taskModel.find({ assignTo: userId }).populate('userId', 'userName email').populate('assignTo', 'userName email')

    if (tasks.length > 0) return res.json({ message: 'success', tasks })

    res.json({ message: 'not found Assignment' })
})

// 6-get all tasks of oneUser with user data
export const allTasksWithOneUser_2 = catchError(async (req, res, next) => {

    let tasks = await taskModel.find({}).populate('userId', 'userName email').populate('assignTo', 'userName email')

    if (tasks.length > 0) return res.json({ message: 'success', tasks })

    next(new AppError(`invalid user ID`, 401))
})


// 7-get all tasks that not done after deadline
export const taskWithAfterDeadLine = catchError(async (req, res, next) => {

    let tasks = await taskModel.find({

        status: { $ne: 'done' },

        deadline: { $lt: new Date().toISOString() }

    }).populate('userId', 'userName email').populate('assignTo', 'userName email')

    // console.log(new Date().toISOString());

    if (tasks.length > 0) return res.json({ message: 'success', tasks })

    res.json({ message: 'not found tasks' })
})

// 3-upload attachment to task
export const add_attchments = catchError(async (req, res, next) => {

    const taskId = req.params.id
    let task_find = await taskModel.findById({ _id: taskId })

    if (task_find) {

        let task = await taskModel.findByIdAndUpdate({ _id: taskId }, { attachments: req.file.filename }, { new: true })

        res.json({ message: 'success', results: task })

    } else {
        next(new AppError("task not found", 401))
    }
})

/**************************** cloudinary *****************/
// 3-upload attachment to task
export const add_attchments_cloud = catchError(async (req, res, next) => {

    const taskId = req.params.id
    let task_find = await taskModel.findById({ _id: taskId })

    if (task_find) {

        const cloud = await cloudinary.uploader.upload(req.file.path, { folder: 'tasks/attachment' })

        let task = await taskModel.findByIdAndUpdate({ _id: taskId }, { attachments: cloud.secure_url }, { new: true })

        res.json({ message: 'success', results: task })

    } else {
        next(new AppError("task not found", 401))
    }

})





// // 3-upload attachment to task
// export const add_attchments = catchError(async (req, res, next) => {

//     const taskId = req.params.id

//     const task = await taskModel.findById(taskId)

//     if (task) {
//         // if (user.logout === true) {
//         //     res.json({ message: "user is logout please sign in to add task " })

//         // } else if (user.deleted === true) {
//         //     res.json({ message: "user doesn't exist cause it deleted before" })

//         // } else if (!user) {
//         //     // console.log(cheakAssignTo);
//         //     res.json({ message: 'this user you want to assign this task not exist 🤔😑' })
//         // } else {
//         // console.log(assignTo);
//         let info = await taskModel.findByIdAndUpdate({ _id: taskId }, { attachments: req.file.filename }, { new: true })
//         res.json({ message: 'DONE', results: info })
//         // }
//     } else {
//         next(new AppError("task not found", 401))

//     }

// })