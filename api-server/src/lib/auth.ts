import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any)?.adminId) {
    next();
  } else {
    res.status(401).json({ error: "غير مصرح. يرجى تسجيل الدخول أولاً." });
  }
}
