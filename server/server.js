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
const mongoUrl = "mongodb+srv://duropiri:DuroReliable2002@cluster1.gf1l1ic.mongodb.net/?retryWrites=true&w=majority"

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
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User already exists" });
    }
    await User.create({
      fname: fname,
      lname: lname,
      email: email,
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

const JWT_SECRET = "sasd*&^&as&9sfsdf8sdfgasd6(*asufa6a7A";

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({email:user.email}, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ status: "error" });

    }
  }
  res.json({ status: "error", error: "Incorrect email or password" });
})

app.post("/userData", async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
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

