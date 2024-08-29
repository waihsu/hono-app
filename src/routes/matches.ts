import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { Match_Status } from "@prisma/client";

const matches = new Hono();

matches.post("/", async (c) => {
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
    const { id } = c.req.param();
    const deletedCountry = await prisma.matches.delete({
      where: { id },
    });
    return c.json({ deletedCountry });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default matches;
