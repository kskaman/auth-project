import User from "../models/user.model";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const updateProfile = async (
  userId: string,
  updates: Record<string, any>,
) => {
  const allowedUpdated = ["email"];

  const filteredUpdates: Record<string, any> = {};

  for (const key of allowedUpdated) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  if (!currentPassword || !newPassword) {
    throw new Error("Current and new password are required");
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;

  user.tokenVersion += 1; // Invalidate existing tokens

  await user.save();

  return {
    message: "Password changed successfully. Please log in again.",
  };
};
