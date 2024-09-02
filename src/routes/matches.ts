import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { Match_Status } from "@prisma/client";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const { websocket, upgradeWebSocket } = createBunWebSocket();

const matches = new Hono();

const topic = "custom1";
matches.use(
  "/",
  upgradeWebSocket((_) => ({
    onOpen(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.subscribe(topic);
      console.log(
        `WebSocket server opened Match and subscribed to topic '${topic}'`
      );
      // rawWs.publish(topic, "hello");
    },
    onMessage(evt, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.publish(topic, "Match");
    },
    onClose(_, ws) {
      const rawWs = ws.raw as ServerWebSocket;
      rawWs.unsubscribe(topic);
      console.log(
        `WebSocket server closed and unsubscribed from topic '${topic}'`
      );
    },
  }))
);

matches.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const {
      homeTeamId,
      awayTeamId,
      matchDate,
    }: {
      homeTeamId: string;
      awayTeamId: string;
      matchDate: string;
    } = await c.req.json();
    if (!homeTeamId || !awayTeamId || !matchDate)
      return Response.json({ messg: "Form not valid" }, { status: 403 });
    const newMatch = await prisma.matches.create({
      data: {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        match_date: matchDate,
      },
    });
    return c.json({ newMatch });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

matches.put("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id } = c.req.param();
    const {
      homeTeamId,
      awayTeamId,
      matchDate,
      matchStatus,
    }: {
      homeTeamId: string;
      awayTeamId: string;
      matchDate: string;
      matchStatus: Match_Status;
    } = await c.req.json();
    const updatedMatch = await prisma.matches.update({
      where: { id },
      data: {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        match_date: matchDate,
        match_status: matchStatus,
      },
    });
    return c.json({ updatedMatch });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

matches.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id } = c.req.param();
    const deletedMatch = await prisma.matches.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedMatch });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

export default matches;
