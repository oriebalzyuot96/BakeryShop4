

var items = require("./models/dba.js")
var cors=require("cors")
// const user=require("./models/dba")
 const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(cors())
// Connect to MongoDB
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//connect between client and server
app.use(express.static(__dirname, "client"));
mongoose.connect("mongodb://localhost/user", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dotenv = require("dotenv").config(); // this plugin to parse .env file to process.env[variable]
var cors = require("cors");
const { connect } = require("./models/db");
const jwt = require("./middlewares/passport-jwt.js");
const protectedRouter = require("./routs/protected-routes.js");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
//connect between client and server
app.use(express.static("/client"));

//routs path
const users = require("./routs/user");
const items = require("./routs/items");
connect
  .then((db) => {
    app.use("/", users);
     app.use("/", items);
    app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    app.use(
      "/api",
      jwt.authenticate("jwt", {
        session: false,
        failureRedirect: "/un-authorized", // if user is not valid token
      }),
      protectedRouter
    );
    app.get("/un-authorized", (req, res) =>
      res.status(401).json({ msg: "you dont have the permissons to be there" })
    );
    app.listen(process.env.PORT, function () {
      console.log(" is listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    if (process.env.NODE_ENV === "dev") console.log(err);
    if (process.env.NODE_ENV === "pro") {
      app.use((req, res, next) => {
        res.status(500).json({ msg: "an internal server error happend" });
      });
    }
  });
module.exports = app;