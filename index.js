require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("./middleware/cors.middleware");
const helmet = require("helmet");
const tolstoyRouter = require("./routes/tolstoy.routes");

const PORT = process.env.PORT;
const baseUrl = process.env.BASE_URL;
const secretKey = process.env.SECRET_KEY;


const app = express();
app.use(cors);
app.use(express.json());

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
        connectSrc: ["'self'", baseUrl],
      },
    },
  })
);


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
