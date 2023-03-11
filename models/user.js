const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  adminPass: String,
  scouterPass: String,
  scouters: [{
    name: String,
    gamesScouted: Number,
  }],
  scoutedTeams: [mongoose.ObjectId],
});

module.exports = mongoose.model('users', userSchema);
