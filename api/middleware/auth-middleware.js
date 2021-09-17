const User = require('../auth/auth-model');

const checkUsernameFree = async (req, res, next) => {
    try {
        const users = await User.findBy({ username: req.body.username })
        if (!users.length) {
            next()
        } else {
            next({ status: 422, "message": "username taken" })
        }
    } catch (err) {
        next(err)
    }
}

const checkRequirements = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            res.status(422).json({
                message: "username and password required"
            })
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
        const [user] = await User.findBy({ username: req.body.username })
        if (!user) {
            next({ status: 401, message: 'invalid credentials' })
        } else {
            req.user = user
            next()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameExists,
    checkRequirements,
}
