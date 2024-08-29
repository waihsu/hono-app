import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const countries = new Hono();

countries.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");
    console.log(token);
    if (!token)
      return Response.json({ messg: "Unauthorized" }, { status: 404 });
    const secret = "mySecretKey";
    const { role } = await verify(token, secret);
    if (role === "USER")
      return Response.json(
        { messg: "Unauthorized You are not admin" },
        { status: 404 }
      );
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
