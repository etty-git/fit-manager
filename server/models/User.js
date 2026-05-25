const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/
    },

    phone: {
      type: String,
      required: function () {
        return !this.googleId;
      }
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null
    },

    membershipStatus: {
      type: String,
      enum: ["Pending", "Active", "Expired"],
      default: "Pending"
    },

    membershipStart: { type: Date, default: null },
    membershipEnd: { type: Date, default: null },

    role: {
      type: String,
      enum: ["admin", "member", "instructor"],
      default: "member"
    },

    joinDate: {
      type: Date,
      default: Date.now
    },

    // ✅ soft delete fix
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);