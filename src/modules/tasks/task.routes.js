import express from 'express'
import { auth } from '../../middleware/auth.js'
import * as taskController from './controller/task.controller.js'
import uploads, { fileVaildation } from '../../utils/multer.js'
import uploadCloud from '../../utils/multerCloud.js'
import { Validation } from '../../middleware/Validation.js'
import * as schemaValidation from './task.validation.js'


const taskRouter = express.Router()

// 1-add task with status (toDo)(user must be logged in)
taskRouter.post('/add', auth, Validation(schemaValidation.addTaskSchema), taskController.addTaskWithStatus)

// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
taskRouter.put('/update', auth, Validation(schemaValidation.updateTaskSchema), taskController.updateTask)

// 3-delete task(user must be logged in) (creator only can delete task)
taskRouter.delete('/delete/:id', auth, Validation(schemaValidation.deleteTaskSchema), taskController.deleteTask)

// 4-get all tasks with user data
taskRouter.get('/all_tasks', taskController.allTasksWithUser)

// 4-get all tasks with creator tasks
taskRouter.get('/creator', auth, Validation(schemaValidation.creatorTasksSchema), taskController.creatorTasks)

// 5-get tasks of oneUser with user data (user must be logged in)
taskRouter.get('/user_tasks', auth, taskController.allTasksWithOneUser_1)

// 6-get all tasks of oneUser with user data
taskRouter.get('/all_user_tasks', auth, taskController.allTasksWithOneUser_2)

// 7-get all tasks that not done after deadline
taskRouter.get('/tasks_not_done', auth, taskController.taskWithAfterDeadLine)


/**************** multer ***************/

// 3-upload attachment to task
taskRouter.post('/add_attchments/:id', Validation(schemaValidation.add_attchmentsSchema), uploads({ folder: '/tasks/attachments', fileType: fileVaildation.file, format: 'file' }).single('file'), taskController.add_attchments)


/**************************** cloudinary *****************/
// 3-upload attachment to task
taskRouter.post('/add_attchments_cloud/:id', Validation(schemaValidation.add_attchmentsSchema), uploadCloud().single('file'), taskController.add_attchments_cloud)

export default taskRouter