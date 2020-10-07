// @ts-ignore
// An example of using composition rather than inheritance, using dependency injection with an abstraction
import db from "db";
import client from "client";
import emailSender from "emailSender";

type User = { name: string; email: string };

// Abstracting out an interface for routes to depend on
interface UserService {
  getUser: (userId: number) => User;
}

// three different concrete implementations of the UserService interface
class DbBackedUserService implements UserService {
  getUser(userId: number): User {
    const connection = db.getConnection();
    const user = connection.load(`select * from user where id = ${userId}`);
    connection.close();
    return user;
  }
}

class ApiBackedUserService implements UserService {
  getUser(userId: number): User {
    return client.loadUser(userId);
  }
}

class TestUserService implements UserService {
  getUser(userId: number): User {
    return { name: "Bob", email: "bob@gov.uk" };
  }
}

// Routes depend on the UserService interface rather than a concrete implementation
class UserRoute {
  userService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getIndex = (req, res) => {
    const user = this.userService.getUser(res.local.userId);
    return res.render("/template/user", user);
  };
}

class PasswordResetRoute {
  userService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getIndex = (req, res) => {
    const user = this.userService.getUser(res.local.userId);
    emailSender.sendEmail(
      user.emailAddress,
      "Hello, reset your password with this"
    );
    return res.render("/template/user", user);
  };
}

var app = express();

// const userService: UserService = new DbBackedUserService()
// const userService: UserService = new ApiBackedUserService()

// We can decide at runtime which implementation to wire up

const userService: UserService = Math.random() >= 0.5 // randomly assign
  ? new TestUserService()
  : new DbBackedUserService();

// but could hard code or drive choice of implementation based on some service configuration, or other mechanism

const userRoute = new UserRoute(userService);
const passwordResetRoute = new PasswordResetRoute(userService);
app.get("/user", userRoute.getIndex);
app.get("/passwordReset", passwordResetRoute.getIndex);
