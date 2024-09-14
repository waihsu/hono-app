import { Hono } from "hono";
import { verify } from "hono/jwt";
import { prisma } from "../../db/prisma";

const publishmatches = new Hono();

publishmatches.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "SUPERADMIN" && role !== "USER")
      return c.json({ messg: "You are not admin" }, 403);
    const { admin_id, match_id }: { admin_id: string; match_id: string } =
      await c.req.json();
    if (!admin_id || !match_id) return c.json({ messg: "Form not valid" }, 403);
    const existPublished = await prisma.publishMatch.findFirst({
      where: { user_id: admin_id, match_id },
    });
    if (!existPublished) {
      const publishedMatch = await prisma.publishMatch.create({
        data: { user_id: admin_id, match_id },
      });
      return c.json({ publishedMatch });
    }
    const publishedMatch = await prisma.publishMatch.delete({
      where: { id: existPublished.id },
    });
    return c.json({ publishedMatch });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

export default publishmatches;
