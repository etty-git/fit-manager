const Plan = require("../models/Plans");
const User = require("../models/User");

// ================= Get All Plans =================
const getAllPlans = async () => {
  return await Plan.find({ isActive: true });
};

const updatePlan = async (id, data) => {
  const allowedFields = [
    "name",
    "price",
    "durationDays",
    "isActive",
    "features",
    "description"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const plan = await Plan.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!plan) throw new Error("Plan not found");

  return plan;
};

const deletePlan = async (id) => {
  const plan = await Plan.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!plan) throw new Error("Plan not found");

  return plan;
};
// רכישת תוכנית (החלק החשוב)
// ================= Subscribe to Plan =================
const subscribeToPlan = async (userId, planId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  if (!plan.isActive) {
    throw new Error("Plan is not active");
  }

  // בדיקה אם כבר יש מנוי פעיל
  if (
    user.membershipEnd &&
    new Date(user.membershipEnd) > new Date()
  ) {
    throw new Error("User already has active subscription");
  }

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + plan.durationDays);

  // 🔥 עדכון לפי השדרוג שלך (planId)
  user.planId = plan._id;
  user.membershipStatus = "Active";
  user.membershipStart = start;
  user.membershipEnd = end;

  await user.save();

  return {
    message: "Subscribed successfully",
    plan: plan.name,
    membershipStart: user.membershipStart,
    membershipEnd: user.membershipEnd
  };
};

module.exports = {
  getAllPlans,
  updatePlan,
  deletePlan,
  subscribeToPlan
};
