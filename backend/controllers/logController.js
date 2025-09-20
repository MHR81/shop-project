import Log from "../models/Log.js";

export const createLog = async (req, res) => {
  try {
    const { user, action, details } = req.body;
    const log = new Log({ user, action, details });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'خطا در ثبت لاگ', error });
  }
};

export const getLogs = async (req, res) => {
  try {
    const query = {};
    if (req.query.user) query.user = req.query.user;
    const logs = await Log.find(query).populate('user', 'name email role');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت لاگ‌ها', error });
  }
};
