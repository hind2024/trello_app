import express from 'express'
import * as userController from './controller/user.controller.js'
import { auth } from '../../middleware/auth.js'
import uploads, { fileVaildation } from '../../utils/multer.js'
import uploadCloud from '../../utils/multerCloud.js'
import { Validation } from '../../middleware/Validation.js'
import * as taskSchema from './user.validation.js'


const userRouter = express.Router()

// 1-signUp 
userRouter.post('/signUp', Validation(taskSchema.signUpSchema), userController.signUp)

// verify email
userRouter.get('/verify/:token', Validation(taskSchema.verifyEmailSchema), userController.verifyEmail)

// reset password
userRouter.post('/requestCode', Validation(taskSchema.sendCodeSchema), userController.sendCode)

// forget password
userRouter.post('/forgetPassword', Validation(taskSchema.forgetPasswordSchema), userController.forgetPassword)

// 2-login-->with create token
userRouter.post('/signIn', Validation(taskSchema.signInSchema), userController.signIn)

// 3-change password (user must be logged in)
userRouter.put('/passChange', auth, Validation(taskSchema.changePasswordSchema), userController.changePassword)

// 4-update user (age , firstName , lastName)(user must be logged in)
userRouter.put('/update', auth, Validation(taskSchema.updateUserSchema), userController.updateUser)

// 5-delete user(user must be logged in)
userRouter.delete('/delete', auth, Validation(taskSchema.deleteUserSchema), userController.deleteUser)

// 6-soft delete(user must be logged in)
userRouter.put('/softDelete', auth, Validation(taskSchema.softDeleteUserSchema), userController.softDeleteUser)

// 7-logout
userRouter.post('/logout', auth, Validation(taskSchema.logoutSchema), userController.logout)

/*************** multer **************/
//1-upload profile pic to user
userRouter.put('/ProfilePic', auth, uploads({ folder: '/users/profilePic', fileType: fileVaildation.image, format: 'Image' }).single('pp'), userController.profilePic)

//2-upload array of cover pic to user
userRouter.post('/coverPic', auth, uploads({ folder: '/users/coverPic', fileType: fileVaildation.image, format: 'Image' }).array('covers', 10), userController.coverPic)

/**************************** cloudinary *****************/
//1-upload profile pic to user
userRouter.put('/ProfilePic_cloud', auth, uploadCloud().single('pp'), userController.profilePic_cloud)

//2-upload array of cover pic to user
userRouter.post('/coverPic_cloud', auth, uploadCloud().array('covers', 10), userController.coverPic_cloud)


export default userRouter