

export const errorMiddleware = (err, req, res, next) => {

    let status = err.statusCode || 500

    // development mode only apper * Stack * else not apper
    process.env.MODE == 'dev' ? res.status(status).json({ err: err.message, stack: err.stack }) : res.status(status).json({ err: err.message })
}