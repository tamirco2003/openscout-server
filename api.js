const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { SALT_ROUNDS, JWT_SECRET } = require("./.consts");

const router = express.Router();

router.use(express.json());

router.post('/signup', async (req, res) => {
  const { username, adminPass, scouterPass } = req.body;

  if (!username || !adminPass || !scouterPass) {
    res.status(400).send({ err: "Not all parameters were provided." });
    return;
  }

  let user = await User
    .findOne({ username })
    .select("_id")
    .exec();

  if (user) {
    res.status(409).send({ err: "User already exists." });
    return;
  }

  if (adminPass === scouterPass) {
    res.status(400).send({ err: 'Passwords are the same.' });
    return;
  }

  const adminHash = await bcrypt.hash(adminPass, SALT_ROUNDS);
  const scouterHash = await bcrypt.hash(scouterPass, SALT_ROUNDS);

  await new User({
    username,
    adminHash,
    scouterHash,
    scouters: [],
    teamsScouted: [],
  }).save().catch(() => {
    res.status(500).send({ err: "Couldn't create user." });
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ err: "Not all parameters were provided." });
    return;
  }

  let user = await User
    .findOne({ username })
    .select("_id username adminPass scouterPass")
    .exec();

  if (!user) {
    res.status(404).send({ err: "User not found." });
    return;
  }

  const isAdmin = bcrypt.compare(password, user.adminPass);
  if (isAdmin) {
    // Send JWT
    let token = jwt.sign({
      username,
      isAdmin: true
    }, JWT_SECRET);
    return;
  }

  const isScouter = bcrypt.compare(password, user.scouterPass);
  if (isScouter) {
    // Send JWT with username and isadmin
    return;
  }

  res.status(401).send({ err: "Wrong password." });
  return;
})

// router.use((req, res) => {return is authed, 401 unauthed otherwise})

// router.get('/scouters', (req, res) => {})
// router.post('/match', (req, res) => {})

// router.use((req, res) => {return is admin, 403 forbidden otherwise})

// router.post('/scouter', (req, res) 
// router.delete('/scouter', (req, res) 
// router.get('/teams', (req, res) 
// router.get('/matches', (req, res) 

router.use((req, res) => res.status(404).send());

module.exports = router;