import User from "../models/user.model";

export const listUsers = async (query: { status: string; search: string }) => {
  const filter: {
    status?: string;
    email?: { $regex: string; $options: string };
  } = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    filter.email = { $regex: query.search, $options: "i" };
  }

  const users = await User.find(filter).select("-password");

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    status: user.status,
  }));
};

export const setUserStatus = async (
  adminId: string,
  targetUserId: string,
  status: "active" | "disabled" | "unverified",
) => {
  if (adminId === targetUserId) {
    throw new Error("Admins cannot change their own account status");
  }

  if (!["active", "disabled"].includes(status)) {
    throw new Error("Invalid account status");
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    { status },
    { new: true },
  );

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    status: user.status,
  };
};
