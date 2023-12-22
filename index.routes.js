import { dbConnection } from "./database/dbConnection.js"
import { errorMiddleware } from "./src/middleware/globalErrorMiddleware.js"
import taskRouter from "./src/modules/tasks/task.routes.js"
import userRouter from "./src/modules/users/user.routes.js"
import { AppError } from "./src/utils/AppError.js"
import { catchError } from "./src/utils/catchError.js"

export const bootstrap = catchError(async (app, express) => {

    app.use(express.json())

    // users routes
    app.use('/user', userRouter)

    // tasks routes
    app.use('/task', taskRouter)

    // display pictures
    app.use(express.static("uploads/users/profilePic"))

    // any routes
    app.use('*', (req, res, next) => {
        next(new AppError(`invalid url can't access this endPoint ${req.originalUrl}`, 500))
    })


    app.use(errorMiddleware)

    // connect to mongoose
    dbConnection()

})