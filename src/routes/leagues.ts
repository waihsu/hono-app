import { Hono } from "hono";
import { prisma } from "../../db/prisma";

const leagues = new Hono();

leagues.post("/", async (c) => {
  try {
    const { name }: { name: string } = await c.req.json();
    if (!name)
      return Response.json({ messg: "Form not valid" }, { status: 403 });
    const newLeague = await prisma.leagues.create({ data: { name } });
    return c.json({ newLeague });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

leagues.put("/:id", async (c) => {
  try {
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
