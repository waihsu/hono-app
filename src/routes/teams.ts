import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const teams = new Hono();

teams.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const {
      name,
      image_url,
      country_id,
      league_id,
    }: {
      name: string;
      image_url: string;
      country_id: string;
      league_id: string;
    } = await c.req.json();
    if (!name || !image_url || !country_id || !league_id)
      return Response.json({ messg: "Form not valid" }, { status: 403 });
    const newTeam = await prisma.teams.create({
      data: { name, image_url, country_id, league_id },
    });
    return c.json({ newTeam });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

teams.put("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id, name }: { id: string; name: string } = await c.req.json();
    const updatedCountry = await prisma.teams.update({
      where: { id },
      data: { name },
    });
    return c.json({ updatedCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

teams.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id } = c.req.param();
    const deletedCountry = await prisma.teams.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default teams;
