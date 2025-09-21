import Log from "../models/Log.js";

// حذف همه لاگ‌ها
export const deleteAllLogs = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ success: true, message: "همه لاگ‌ها حذف شدند." });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در حذف همه لاگ‌ها", error });
  }
};

// حذف لاگ‌های یک کاربر خاص
export const deleteUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    await Log.deleteMany({ user: userId });
    res.json({ success: true, message: `لاگ‌های کاربر ${userId} حذف شدند.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطا در حذف لاگ‌های کاربر", error });
  }
};
