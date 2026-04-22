import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsers } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "اسم المستخدم وكلمة المرور مطلوبان" });
    return;
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
  if (!user) {
    res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    return;
  }

  (req.session as any).adminId = user.id;
  (req.session as any).adminUsername = user.username;
  res.json({ success: true, username: user.username });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {});
  res.json({ success: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({
    authenticated: true,
    username: (req.session as any).adminUsername,
  });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
    return;
  }

  const adminId = (req.session as any).adminId;
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId));
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "كلمة المرور الحالية غير صحيحة" });
    return;
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db.update(adminUsers).set({ passwordHash: hash }).where(eq(adminUsers.id, adminId));
  res.json({ success: true });
});

export default router;
