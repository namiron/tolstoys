require("dotenv").config();
const xss = require("xss");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const crypto = require("crypto");
const tolstoyRouter = require("./routes/tolstoy.routes");

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

const corsOptions = {
  origin: "https://tolstoyc.vercel.app",
  credentials: true,
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};

app.options("*", cors(corsOptions));

app.use(cors(corsOptions));
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

app.get("/api/get-secret-token", (req, res) => {
  try {
    if (!secretKey) {
      return res.status(500).json({ message: "Secret key not configured." });
    }

  
    const token = crypto
      .createHmac("sha256", secretKey)
      .update(crypto.randomBytes(64).toString("hex"))
      .digest("hex");

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating token: " + error.message });
  }
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
