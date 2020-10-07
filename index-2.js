// Duplicating logic

import db from 'db'
import emailSender from 'emailSender'

class UserRoute {
    getIndex = (req, res) => {
        const connection = db.connect()
        const user = connection.load(`select * from user where id = ${res.locals.userId}`)
        connection.close()

        return res.render('/template/user', user)
    }
}

class PasswordResetRoute {
    getIndex = (req, res) => {
        const connection = db.connect()
        const user = connection.load(`select * from user where id = ${res.locals.userId}`)
        connection.close()

        emailSender.sendEmail(user.emailAddress, 'Hello, reset your password with this')
        return res.render('/template/user', user)
    }
}

const userRoute = new UserRoute()
const passwordResetRoute = new PasswordResetRoute()

var app = express()
app.get('/user', userRoute.getIndex)
app.get('/passwordReset', passwordResetRoute.getIndex)





