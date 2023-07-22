const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords are not the same",
      },
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  if (user) {
    return true;
  }

  return false;
};

userSchema.statics.comparePass = async function (userId, pass) {
  const user = await this.findOne({ _id: userId }).select("+password");

  return await bcrypt.compare(pass, user.password);
};

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(this.password, salt);
  this.password = hashedPass;
  this.confirmPassword = hashedPass;
});

module.exports = mongoose.model("User", userSchema);
