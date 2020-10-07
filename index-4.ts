// @ts-ignore

// An example of using composition rather than inheritance
import db from 'db'
import emailSender from 'emailSender'


class DbBackedUserService {
    getUser = (userId) => {
        const connection = db.getConnection()
        const user = connection.load(`select * from user where id = ${userId}`)
        connection.close()
        return user
    }
}

class UserRoute {
    // Each route has a hard coded dependency on a concrete class
    // concrete class == a specific implementation, "this user service is backed by a database"
    userService = new DbBackedUserService()

    getIndex = (req, res) => {
        const user = this.userService.getUser(res.local.userId)
        return res.render('/template/user', user)
    }
}

class PasswordResetRoute {
    userService = new DbBackedUserService()

    getIndex = (req, res) => {
        const user = this.userService.getUser(res.local.userId)
        emailSender.sendEmail(user.emailAddress, 'Hello, reset your password with this')
        return res.render('/template/user', user)
    }
}


var app = express()

const userRoute = new UserRoute()
const passwordResetRoute = new PasswordResetRoute()
app.get('/user', userRoute.getIndex)
app.get('/passwordReset', passwordResetRoute.getIndex)





