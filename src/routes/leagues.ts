import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { bearerAuth } from "hono/bearer-auth";
import { jwt, verify } from "hono/jwt";

const leagues = new Hono();

leagues.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const {
      name,
      code,
      image_url,
      type,
      country_id,
    }: {
      name: string;
      code: string;
      image_url: string;
      type: string;
      country_id: string;
    } = await c.req.json();
    if (!name || !code || !image_url || type || country_id)
      return c.json({ messg: "Form not valid" }, 403);
    const newLeague = await prisma.leagues.create({
      data: { name, code, image_url, type, country_id },
    });
    return c.json({ newLeague });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

leagues.put("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id, name }: { id: string; name: string } = await c.req.json();
    const updatedLeague = await prisma.leagues.update({
      where: { id },
      data: { name },
    });
    return c.json({ updatedLeague });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

leagues.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id } = c.req.param();
    const deletedLeague = await prisma.leagues.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedLeague });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default leagues;
