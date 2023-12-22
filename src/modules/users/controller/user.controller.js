import userModel from "../../../../database/models/users.model.js"
import bcrypt from 'bcrypt'
import jwt, { decode } from 'jsonwebtoken'
import { sendEmail } from "../../../../emails/user.email.js"
import { confirmEmailStyle, sendCodeStyle } from "../../../../emails/MessageStyle/message.style.js"
import { catchError } from "../../../utils/catchError.js"
import cloudinary from "../../../utils/cloudinary.js"
import { AppError } from "../../../utils/AppError.js"


// 1-signUp 
export const signUp = catchError(async (req, res, next) => {

    const { userName, email, password, cPassword, age, gender, phone } = req.body

    if (password === cPassword) {

        const user = await userModel.findOne({ email })

        if (user) {
            res.json({ message: "email already exists" })

        } else {

            const hash = bcrypt.hashSync(password, parseInt(process.env.ROUND))
            // console.log(process.env.ROUND);
            await userModel.insertMany({ userName, email, password: hash, age, gender, phone })

            let tokenEmail = jwt.sign({ email }, process.env.SECRET_KEY_EMAILCONF, { expiresIn: 60 * 60 * 2 })

            let subject = 'Confirm Email 👋'

            let message = confirmEmailStyle(tokenEmail)

            sendEmail(email, subject, message)

            res.json({ message: "success" })

        }

    } else {
        res.json({ message: "password mis match confirm password" })

    }

})


export const verifyEmail = catchError(async (req, res, next) => {

    const { token } = req.params

    jwt.verify(token, process.env.SECRET_KEY_EMAILCONF, async (err, decoded) => {

        if (err) {
            res.json({ message: 'invalid token', err })
        } else {
            let user = await userModel.findOne({ email: decoded.email })
            // console.log(user)

            if (user) {
                let confirmInfo = await userModel.findOneAndUpdate({ email: decoded.email }, { emailConfirm: true }, { new: true })
                res.json({ message: 'success' })
            } else {

                res.json({ message: 'user not found' })
            }
        }
    })

})

// sendCode
export const sendCode = catchError(async (req, res, next) => {

    const { email } = req.body

    const user = await userModel.findOne({ email }, { email: 1, deleted: 1, emailConfirm: 1, code: 1, userName: 1 })
    // const user = await userModel.findOne({ email })

    if (!user) {
        res.json({ message: 'Email not found' })
    } else {
        if (user.deleted === true && user.emailConfirm == false) {
            res.json({ message: "Can not send code to not register account" });

        } else {
            // const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
            const code = Math.floor(Math.random() * 900000) + 100000

            await userModel.updateOne({ email: user.email }, { code })

            // console.log(code);
            let message = sendCodeStyle(code, user.userName)
            let subject = 'forget password ✍️'

            sendEmail(user.email, subject, message)

            res.json({ message: 'success' })

        }
    }
})


// forgot password
export const forgetPassword = catchError(async (req, res, next) => {

    const { email, code, password, cPassword } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        res.json({ message: "Not register account" })

    } else {

        if (password != cPassword) {
            res.json({ message: "password mis match confirm password" })

        } else if (code != user.code || code == null) {
            res.json({ message: "In-valid Code" })

        } else {
            const hash = bcrypt.hashSync(password, parseInt(process.env.ROUND))
            let userAcc = await userModel.findOneAndUpdate({ email: user.email }, { password: hash, code: null }, { new: true })

            res.json({ message: 'success', userAcc })
        }
    }

})


// 2-login-->with create token
export const signIn = catchError(async (req, res, next) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (user && bcrypt.compareSync(password, user.password)) {

        if (user.deleted === true) {
            res.json({ message: "User is not found, please sign up" });

        } else if (user.emailConfirm == true) {

            let token = jwt.sign({ id: user.id, userName: user.userName, role: user.role }, process.env.SECRET_KEY)
            await userModel.findOneAndUpdate({ email }, { logout: false })

            res.json({ message: "success", token })

        } else {
            res.json({ message: "Plz confirm your email first" });

        }

    } else {

        res.json({ message: "email or password incorrect" })
    }

})


// 3-change password (user must be logged in)
export const changePassword = catchError(async (req, res, next) => {

    const { oldPassword, newPassword, cPassword } = req.body

    const userId = req.userId

    const user = await userModel.findById(userId)

    if (user) {

        if (user.logout == true) {
            res.json({ message: "user is logout please sign in to change password" })

        } else if (user.deleted == true) {
            res.json({ message: "user doesn't exist cause it deleted before" })

        } else if (!bcrypt.compareSync(oldPassword, user.password)) {
            res.json({ message: "oldPassword incorrect" })

        } else if (newPassword !== cPassword) {
            res.json({ message: "newpassword mis match confirm password" })

        } else {
            const hash = bcrypt.hashSync(newPassword, parseInt(process.env.ROUND))

            let newPss = await userModel.findByIdAndUpdate(userId, { password: hash })
            res.json({ message: "success", newPss })

        }
    } else {
        res.json({ message: "account not found" })

    }
})


// 4-update user (age , firstName , lastName)(user must be logged in)
export const updateUser = catchError(async (req, res, next) => {

    const userId = req.userId

    const user = await userModel.findById(userId)

    if (!user) {

        res.json({ message: "account not found" })

    } else if (user.logout === true) {
        res.json({ message: "User is logout, please log in" });

    } else if (user.deleted === true) {

        res.json({ message: "User is not found, please sign up" });
    } else {

        const { userName, age, gender, phone } = req.body

        let user = await userModel.findByIdAndUpdate(userId, { userName, age, gender, phone }, { new: true })
        res.json({ message: "success", user })

    }
})



// 5-delete user(user must be logged in)
export const deleteUser = catchError(async (req, res, next) => {

    const userId = req.userId

    const user = await userModel.findById(userId)

    if (!user) {
        res.json({ message: "account not found" })

    } else if (user.deleted === true) {
        res.json({ message: "User is deleted before" })

    } else if (user.logout === true) {
        res.json({ message: "User is logout, please log in" });

    } else {
        let user = await userModel.findByIdAndDelete(userId)

        res.json({ message: "success", user })

    }
})



// 6-soft delete(user must be logged in)
export const softDeleteUser = catchError(async (req, res, next) => {

    const userId = req.userId

    const user = await userModel.findById(userId)

    if (user) {

        if (user.logout == true) {
            res.json({ message: "user is logout please sign in " })

        } else if (user.deleted == true) {
            res.json({ message: "user doesn't exist cause it deleted before" })

        } else {
            let user = await userModel.findByIdAndUpdate(userId, { deleted: true }, { new: true })
            res.json({ message: "success", user })

        }

    } else {
        res.json({ message: "account not found" })
    }

})


// 7-logout
export const logout = catchError(async (req, res, next) => {

    const userId = req.userId

    const user = await userModel.findById(userId)

    if (user) {

        if (user.logout == true) {
            res.json({ message: "user is already logout" })

        } else if (user.deleted == true) {
            res.json({ message: "user doesn't exist cause it deleted before" })

        } else {
            let user = await userModel.findByIdAndUpdate(userId, { logout: true }, { new: true })
            res.json({ message: "success", user })
        }

    } else {
        res.json({ message: "account not found" })

    }

})

/*************** multer **************/

// 1-upload profile pic to user
export const profilePic = catchError(async (req, res, next) => {

    const userId = req.userId
    let user = await userModel.findByIdAndUpdate(userId, { profilePic: req.file.filename }, { new: true })

    res.json({ message: 'success', results: user })
})


// 2-upload array of cover pic to user
export const coverPic = catchError(async (req, res, next) => {

    const userId = req.userId
    let user = await userModel.findById(userId)

    if (user) {

        req.files.forEach((elm) => {
            user.coverPic.push(elm.filename)
        })

        const userUpadted = await user.save()
        res.json({ message: 'success', results: userUpadted })

    } else {
        next(new AppError(`user not found`, 401))
    }

})


/*************** cloudinary **************/

// 1-upload profile pic to user
export const profilePic_cloud = catchError(async (req, res, next) => {

    const userId = req.userId
    const cloud = await cloudinary.uploader.upload(req.file.path, { folder: 'users/profile_pic' })

    let user = await userModel.findByIdAndUpdate(userId, { profilePic: cloud.secure_url }, { new: true })

    res.json({ message: 'success', results: user })

})


// 2-upload array of cover pic to user
export const coverPic_cloud = catchError(async (req, res, next) => {

    const userId = req.userId

    let user = await userModel.findById(userId)
    if (user) {

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const cloud = await cloudinary.uploader.upload(file.path)

            user.coverPic.push(cloud.secure_url)

        }

        const userUpadted = await user.save()
        res.json({ message: 'success', results: userUpadted })

    } else {
        next(new AppError(`user not found`, 401))
    }
})

