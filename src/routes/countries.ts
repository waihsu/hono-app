import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const countries = new Hono();

countries.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { name }: { name: string } = await c.req.json();
    if (!name)
      return Response.json({ messg: "Form not valid" }, { status: 403 });
    const newCountry = await prisma.countries.create({ data: { name } });
    return c.json({ newCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

countries.put("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { id, name }: { id: string; name: string } = await c.req.json();
    const updatedCountry = await prisma.countries.update({
      where: { id },
      data: { name },
    });
    return c.json({ updatedCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

countries.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { id } = c.req.param();
    const deletedCountry = await prisma.countries.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default countries;
