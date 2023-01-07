import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

import { format } from 'date-fns';

dotenv.config();

// console.log(process.env.OPENAI_API_KEY);

// console.log(process.env.AUTH0_DOMAIN);
// console.log(process.env.AUTH0_CLIENT_ID);
const LOCALORSERVERS = [`http://localhost:5000`,`https://relayai.onrender.com`]
const url1 = `http://localhost:3000/`;
const url2 = `https://relay-ai.vercel.app/`;
const URLS = [url1, url2];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI Api
const openai = new OpenAIApi(configuration);

// MongoDB connection
const mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => { console.log(err) });







// App setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));



app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from RelayAI',
  })
});

app.get('/openai', async (req, res) => {
  res.status(200).send({
    message: 'Hello from OpenAIAPI',
  })
});

// App to OpenAI Api
app.post('/openai', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.9,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })

    const output = response.data.choices[0].text;

    console.log("Prompt: " + prompt);
    console.log("Response: " + output);

    res.status(200).send({
      bot: output,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error });
  }
})

// App to Mongodb
import bcrypt from 'bcryptjs';

import User from "./controllers/userDetails.js";
app.post("/signup", async (req, res) => {
  const { fname, lname, email, mobile, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUserEmail = await User.findOne({ email });
    const oldUserMobile = await User.findOne({ mobile });
    if (oldUserEmail) {
      return res.send({ error: "User already exists" });
    }
    if (oldUserMobile) {
      return res.send({ error: "Mobile already in use" });
    }
    await User.create({
      fname: fname,
      lname: lname,
      email: email,
      mobile: mobile,
      password: encryptedPassword,
    })
    res.send({ status: "ok" })
    console.log("success");
  } catch (error) {
    res.send({ status: "error" })
    console.log("error");
  }
})

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "60d" });


    if (res.status(201)) {
      console.log("success");
      return res.json({ status: "ok", data: token });
    } else {
      console.log("error");
      return res.json({ status: "error" });
    }
  }
  res.json({ status: "error", error: "Incorrect email or password" });
})

app.post("/userData", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });

    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data })
      })
      .catch((error) => {
        res.send({ status: "error", error })
      })
  } catch (error) {
  }
})

const pass = process.env.PASS;
const adminEmail = process.env.ADMIN_EMAIL;
//User password reset
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user exists with email
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User not found" });
    }
    // If user exists generate a secret and a token
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '5m' });
    // Create a unique link
    const link = `${LOCALORSERVERS[1]}/reset-password/${oldUser._id}/${token}`;
    //////////////////////////////////////////////////////////////////
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: pass
      }
    });

    var mailOptions = {
      from: adminEmail,
      to: oldUser.email,
      subject: 'Password Reset',
      text: link
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    //////////////////////////////////////////////////////////////////
    console.log(link);
    return res.json({ status: "ok", data: token });
  } catch (error) {

  }
})

// Recieve id and token from url
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  // Check if user exists with id
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User not found" });
  }
  // If user exists verify token
  const secret = JWT_SECRET + oldUser.password;
  try {
    // If token is correct go to index from views
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not verified" });
  } catch (error) {
    res.send("Not verified")
  }
})

// Back to same url but with post
app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  // Check if user exists with id again
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User not found" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    // First encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Find user by id in database from url user id
    await User.updateOne(
      {
        _id: id
      },
      {
        // Change user's password
        $set: {
          password: encryptedPassword,
        },
      }
    )

    // res.json({ status: "Password Updated" })
    // redirect to index from views but pass status
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    res.redirect = URLS[1];
    // res.json({ status: "Something went wrong" })
  }
})


const PORT = process.env.PORT || 5000;
console.log(format(new Date(), 'yyyy-MM-dd\tHH:mm:ss'))
app.listen(PORT, () => console.log(`App is running on port http://localhost:${PORT} or https://relayai.onrender.com`));

