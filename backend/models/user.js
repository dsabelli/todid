const mongoose = require("mongoose");

const schema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxLength: 18,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dateFormat: {
    type: String,
    default: "MMM-dd-yyyy",
  },
  vToken: {
    type: String,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  didits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Didit",
    },
  ],
});

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
    delete returnedObject.vToken;
  },
});

module.exports = mongoose.model("User", schema);
