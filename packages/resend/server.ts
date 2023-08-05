require("dotenv").config();

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { db as prisma } from "./db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(cors());

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    await prisma.user.create({
      data: {
        email,
        otp,
        // force it by now
        isVerified: true,
      },
    });

    await resend.emails.send({
      from: "Esau Morais <admin@emots.dev>",
      to: email,
      subject: "OTP for Mobile App",
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

app.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    await prisma.user.delete({
      where: { email },
    });

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
