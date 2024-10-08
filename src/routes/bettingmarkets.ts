import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { $Enums } from "@prisma/client";

const bettingMarkets = new Hono();

bettingMarkets.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const {
      market_type,
      publish_match_id,
    }: {
      market_type: string;
      publish_match_id: string;
    } = await c.req.json();
    if (!market_type || !publish_match_id)
      return Response.json({ messg: "Form not valid" }, { status: 403 });
    const newBettingMarket = await prisma.bettingMarkets.create({
      data: { market_type, publish_match_id },
    });
    return c.json({ newBettingMarket });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

bettingMarkets.put("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      id,
      market_type,
      market_status,
    }: {
      id: string;
      market_type: string;
      market_status: $Enums.MarketStatus;
    } = await c.req.json();
    const updatedBettingMarket = await prisma.bettingMarkets.update({
      where: { id },
      data: { market_status, market_type },
    });
    return c.json({ updatedBettingMarket });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

bettingMarkets.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { id } = c.req.param();
    const deletedBettingMarket = await prisma.bettingMarkets.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedBettingMarket });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default bettingMarkets;
