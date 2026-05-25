const Message = require("../models/Message");
const User = require("../models/User");

const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user) return res.status(404).json({ error: "User not found" });

    const roleQuery =
      user.role === "admin"
        ? {}
        : {
            $or: [
              { to: user._id },
              { to: null, toRole: user.role },
              { from: user._id }
            ]
          };

    const messages = await Message.find(roleQuery)
      .populate("from", "name email role")
      .populate("to", "name email role")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { toRole, toEmail, subject, body } = req.body;

    if (!toRole || !subject || !body) {
      return res.status(400).json({ error: "Recipient role, subject and message are required" });
    }

    let recipient = null;

    if (toEmail) {
      recipient = await User.findOne({
        email: String(toEmail).trim().toLowerCase(),
        role: toRole,
        isDeleted: { $ne: true }
      });

      if (!recipient) {
        return res.status(404).json({ error: "Recipient was not found" });
      }
    }

    const message = await Message.create({
      from: req.user.id,
      to: recipient?._id || null,
      toRole,
      subject,
      body
    });

    await message.populate("from", "name email role");
    await message.populate("to", "name email role");

    res.status(201).json({ message: "Message sent", item: message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMessages,
  createMessage
};
