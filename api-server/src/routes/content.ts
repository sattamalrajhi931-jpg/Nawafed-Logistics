import { Router } from "express";
import { db, siteContent } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/", async (req, res) => {
  const rows = await db.select().from(siteContent);
  const result: Record<string, any> = {};
  for (const row of rows) {
    result[row.sectionKey] = row.content;
  }
  res.json(result);
});

router.get("/:section", async (req, res) => {
  const { section } = req.params;
  const [row] = await db.select().from(siteContent).where(eq(siteContent.sectionKey, section));
  if (!row) {
    res.status(404).json({ error: "القسم غير موجود" });
    return;
  }
  res.json(row.content);
});

router.put("/:section", requireAuth, async (req, res) => {
  const { section } = req.params;
  const content = req.body;

  if (!content || typeof content !== "object") {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  const existing = await db.select().from(siteContent).where(eq(siteContent.sectionKey, section));

  if (existing.length > 0) {
    const [row] = await db
      .update(siteContent)
      .set({ content, updatedAt: new Date() })
      .where(eq(siteContent.sectionKey, section))
      .returning();
    res.json(row.content);
  } else {
    const [row] = await db
      .insert(siteContent)
      .values({ sectionKey: section, content, updatedAt: new Date() })
      .returning();
    res.json(row.content);
  }
});

export default router;
