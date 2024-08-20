require("dotenv").config();
const xss = require("xss");
const express = require("express");
const session = require("express-session");
const cors = require("./middleware/cors.middleware");
const helmet = require("helmet");
const tolstoyRouter = require("./routes/tolstoy.routes");
const csurf = require("csurf");

const PORT = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

const cleanObject = (obj) => {
  if (typeof obj === "string") {
    return xss(obj);
  }
  if (typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = cleanObject(obj[key]);
      }
    }
  }
  return obj;
};

const app = express();

 
app.use(cors);
app.use(express.json());
app.use((req, res, next) => {
  req.body = cleanObject(req.body);
  next();
});

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
  })
);

 
app.use(csurf({ cookie: { httpOnly: true, secure: true, sameSite: "lax" } }));

 
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/urls", tolstoyRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server error", error);
    process.exit(1);
  }
};

module.exports = app;

if (require.main === module) {
  start();
}
