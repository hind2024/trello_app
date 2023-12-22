import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
    let token = req.header('token')

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

        if (err) {
            res.json({ message: 'Invalid token', err })
        } else {
            // console.log(decoded);

            req.userId = decoded.id
            next()
        }

    })
}



