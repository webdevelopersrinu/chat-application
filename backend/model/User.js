import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter your name"],
      validate: [validator.isAlpha, "Enter a valid name"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter your name"],
      validate: [validator.isAlpha, "Enter a valid name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      validate: [validator.isStrongPassword, "Please enter a strong password"],
      select: false
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    passwordChangedAt: Date,
    changePasswordResetToken: String,
    changePasswordResetTokenExpaire: Date,
  },
  { timestamps: true }
);

// Encrypting password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcryptjs.hash(this.password, 12);
  } catch (err) {
    return next(err); // Pass the error to the error handler
  }
  next();
});

// Password comparison method
userSchema.methods.compairePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// add softe delete functionality
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  let resetToken = crypto.randomBytes(32).toString("hex");
  this.changePasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.changePasswordResetTokenExpaire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
