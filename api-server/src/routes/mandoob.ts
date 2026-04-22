import { Router } from "express";
import { db, mandoobRegistrations } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  CreateMandoobBody,
  UpdateMandoobStatusBody,
  ListMandoobQueryParams,
  UpdateMandoobStatusParams,
  DeleteMandoobParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/stats", async (req, res) => {
  const rows = await db
    .select({
      status: mandoobRegistrations.status,
      count: sql<number>`count(*)::int`,
    })
    .from(mandoobRegistrations)
    .groupBy(mandoobRegistrations.status);

  const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
  for (const row of rows) {
    stats.total += row.count;
    if (row.status === "pending") stats.pending = row.count;
    if (row.status === "approved") stats.approved = row.count;
    if (row.status === "rejected") stats.rejected = row.count;
  }

  res.json(stats);
});

router.get("/", async (req, res) => {
  const parsed = ListMandoobQueryParams.safeParse(req.query);
  const status = parsed.success ? parsed.data.status : undefined;

  const rows = status
    ? await db
        .select()
        .from(mandoobRegistrations)
        .where(eq(mandoobRegistrations.status, status))
        .orderBy(sql`${mandoobRegistrations.createdAt} DESC`)
    : await db
        .select()
        .from(mandoobRegistrations)
        .orderBy(sql`${mandoobRegistrations.createdAt} DESC`);

  res.json(
    rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      phone: r.phone,
      nationalId: r.nationalId,
      city: r.city,
      vehicleType: r.vehicleType,
      hasLicense: r.hasLicense,
      experience: r.experience,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.post("/", async (req, res) => {
  const parsed = CreateMandoobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const [row] = await db
    .insert(mandoobRegistrations)
    .values({
      fullName: data.fullName,
      phone: data.phone,
      nationalId: data.nationalId,
      city: data.city,
      vehicleType: data.vehicleType,
      hasLicense: data.hasLicense,
      experience: data.experience,
      notes: data.notes ?? null,
      status: "pending",
    })
    .returning();

  res.status(201).json({
    id: row.id,
    fullName: row.fullName,
    phone: row.phone,
    nationalId: row.nationalId,
    city: row.city,
    vehicleType: row.vehicleType,
    hasLicense: row.hasLicense,
    experience: row.experience,
    notes: row.notes,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateMandoobStatusParams.parse(req.params);
  const parsed = UpdateMandoobStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صحيحة" });
    return;
  }

  const [row] = await db
    .update(mandoobRegistrations)
    .set({ status: parsed.data.status })
    .where(eq(mandoobRegistrations.id, id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "السجل غير موجود" });
    return;
  }

  res.json({
    id: row.id,
    fullName: row.fullName,
    phone: row.phone,
    nationalId: row.nationalId,
    city: row.city,
    vehicleType: row.vehicleType,
    hasLicense: row.hasLicense,
    experience: row.experience,
    notes: row.notes,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteMandoobParams.parse(req.params);
  await db
    .delete(mandoobRegistrations)
    .where(eq(mandoobRegistrations.id, id));
  res.status(204).send();
});

export default router;
