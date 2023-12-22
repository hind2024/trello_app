import Joi from "joi";




export const Validation = (schema) => {
    return (req, res, next) => {

        const valid = schema.validate({ ...req.body, ...req.params, ...req.query }, { abortEarly: false })

        // console.log(req.headers.token)

        if (valid.error) {

            let errors = valid.error.details.map((elm) => {
                return { key: elm.path[0], errorMsg: elm.message }
            })

            res.json({ message: errors })

        } else {
            next()
        }

    }
}