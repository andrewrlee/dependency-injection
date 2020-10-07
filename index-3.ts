// @ts-ignore

// Using Inheritance to share logic

// http://neethack.com/2017/04/Why-inheritance-is-bad/

import db from 'db'
import express from 'express'
import emailSender from 'emailSender'


abstract class AbstractRoute {
    getUser = (userId) => {
        const connection = db.connect()
        const user = connection.load(`select * from user where id = ${userId}`)
        connection.close()
        return user
    }
}


class UserRoute extends AbstractRoute {
    getIndex = (req, res) => {
        const user = this.getUser(res.local.userId)
        return res.render('/template/user', user)
    }
}

class PasswordResetRoute extends AbstractRoute {
    getIndex = (req, res) => {
        const user = this.getUser(res.local.userId)
        emailSender.sendEmail(user.emailAddress, 'Hello, reset your password with this')
        return res.render('/template/user', user)
    }
}

var app = express()

const userRoute = new UserRoute()
const passwordResetRoute = new PasswordResetRoute()
app.get('/user', userRoute.getIndex)
app.get('/passwordReset', passwordResetRoute.getIndex)





