import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    province: { type: String },
    city: { type: String },
    address: { type: String },
    postCode: { type: String },
    mobile: { type: String },

    // reset password token (hashed) and expiry (optional)
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},
    { timestamps: true });

// before save -> hash password if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// create reset token (plain token returned; hashed saved in db)
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
