// @ts-ignore
// An example of using composition rather than inheritance, using dependency injection with a concrete  class
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
    userService

    constructor(userService: DbBackedUserService) {
        this.userService = userService
    }
    
    getIndex = (req, res) => {
        const user = this.userService.getUser(res.local.userId)
        return res.render('/template/user', user)
    }
}

class PasswordResetRoute {
    userService

    constructor(userService: DbBackedUserService) {
        this.userService = userService
    }

    getIndex = (req, res) => {
        const user = this.userService.getUser(res.local.userId)
        emailSender.sendEmail(user.emailAddress, 'Hello, reset your password with this')
        return res.render('/template/user', user)
    }
}




var app = express()

const userService = new DbBackedUserService()

const userRoute = new UserRoute(userService)
const passwordResetRoute = new PasswordResetRoute(userService)
app.get('/user', userRoute.getIndex)
app.get('/passwordReset', passwordResetRoute.getIndex)





