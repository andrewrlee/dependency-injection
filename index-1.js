// Extracting out route handler logic from where routes are registered 

// Route as a class
class UserRoute {
    getIndex = (req, res) => {
        return res.render('/template/user')
    }
}

const userRoute = new UserRoute()
var app = express()
app.get('/user', userRoute.getIndex)


// Route as a function
const UserRoute = () => {
    getIndex: (req, res) => {
        return res.render('/template/user')
    }
}

const userRoute = UserRoute()
var app = express()
app.get('/user', userRoute.getIndex)





