import { Router, type IRouter } from "express";
import { CreateContactSubmissionBody } from "@workspace/api-zod";
import { db, contactSubmissionsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = CreateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues }, "invalid contact submission");
    return res.status(400).json({ error: "Invalid submission" });
  }

  // Conditional requiredness: a message needs body text; a call needs a time.
  const { type, message, preferredTime } = parsed.data;
  if (type === "message" && !message?.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }
  if (type === "call" && !preferredTime?.trim()) {
    return res.status(400).json({ error: "Preferred time is required" });
  }

  const [row] = await db
    .insert(contactSubmissionsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ id: row.id, type: row.type }, "contact submission stored");
  return res.status(201).json(row);
});

export default router;
