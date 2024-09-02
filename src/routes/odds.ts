import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const odds = new Hono();

odds.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    console.log(await c.req.json());
    const {
      betting_market_id,
      odd_value,
      outcome,
      team_id,
    }: {
      betting_market_id: string;
      outcome: string;
      odd_value: string;
      team_id: string;
    } = await c.req.json();
    if (!betting_market_id || !outcome || !odd_value || !team_id)
      return c.json({ messg: "Form not valid" }, 403);
    const newOdd = await prisma.odds.create({
      data: {
        odd_value: Number(odd_value),
        outcome,
        betting_market_id,
        team_id,
      },
    });
    return c.json({ newOdd });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, { status: 405 });
  }
});

odds.put("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      id,
      betting_market_id,
      outcome,
      odd_value,
      team_id,
    }: {
      id: string;
      betting_market_id: string;
      outcome: string;
      odd_value: string;
      team_id: string;
    } = await c.req.json();
    const updatedCountry = await prisma.odds.update({
      where: { id },
      data: {
        betting_market_id,
        outcome,
        odd_value: Number(odd_value),
        team_id,
      },
    });
    return c.json({ updatedCountry });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

odds.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { id } = c.req.param();
    const deletedOdd = await prisma.odds.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedOdd });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

export default odds;
