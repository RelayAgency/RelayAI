import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import mongoose from 'mongoose';

import { format } from 'date-fns';

dotenv.config();

// console.log(process.env.OPENAI_API_KEY);

// console.log(process.env.AUTH0_DOMAIN);
// console.log(process.env.AUTH0_CLIENT_ID);

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


app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from RelayAI',
  })
});

// App to OpenAI Api
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.7,
      max_tokens: 256,
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
    console.log(error);
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




const PORT = process.env.PORT || 5000;
console.log(format(new Date(), 'yyyy-MM-dd\tHH:mm:ss'))
app.listen(PORT, () => console.log(`App is running on port http://localhost:${PORT} or https://relayai.onrender.com`));

