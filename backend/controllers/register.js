const bcrypt = require("bcrypt");
const validator = require("validator");
const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(config.SENDGRID_API_KEY);

router.post("/", async (request, response) => {
  const { email, username, password, confirmPassword, date } = request.body;

  const existingEmail = await User.findOne({ email });
  if (!validator.isEmail(email)) {
    return response.status(400).json({ error: "Please enter a valid email" });
  }
  if (existingEmail) {
    return response.status(400).json({
      error: "An account with this email address already exists",
    });
  }

  if (!password || !validator.isStrongPassword(password)) {
    return response.status(400).json({
      error:
        "Password must include 8-16 characters with a mix of letters, numbers & symbols.",
    });
  }
  if (password !== confirmPassword) {
    return response.status(400).json({
      error: "Passwords must match",
    });
  }

  const token = jwt.sign({ email: email }, config.EMAIL_SECRET);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    username,
    passwordHash,
    date,
    vToken: token,
  });

  const savedUser = await user.save();
  if (savedUser) {
    await sgMail.send({
      to: email,
      from: "noreply@todidit.com",
      subject: "Please verify your account",
      html: `<h1>You're nearly there!</h1>
      <h2>Hi ${username},</h2>
      <p>To finish setting up your account, verify we've got the correct email for you.</p>
          <button><a href=http://localhost:3000/verify/${token}>Verify your email</a></button>`,
    });
    response.status(201).json(savedUser);
  } else
    response.status(500).json({
      error: "Unable to register createTestAccount, please try again later",
    });
});

router.get("/verify/:token", async (request, response) => {
  const token = request.params.token;
  const verifiedUser = await User.findOne({ vToken: token });
  if (!verifiedUser) {
    return response.status(404).json({ error: "Account not found" });
  }

  verifiedUser.verified = true;
  const savedUser = await verifiedUser.save();

  response.status(200).json(savedUser);
});

// router.get("/", async (request, response) => {
//   const existingEmail = await User.findOne({ email: request.query.email });
//   if (existingEmail) {
//     return response.status(400).json({
//       error: "An account with this email address already exists, try another.",
//     });
//   }
// });

module.exports = router;
