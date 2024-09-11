import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { bearerAuth } from "hono/bearer-auth";
import { jwt, verify } from "hono/jwt";

const runningleagues = new Hono();

runningleagues.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "SUPERADMIN")
      return c.json({ messg: "You are not admin" }, 401);
    const { league_id, teamIds }: { league_id: string; teamIds: string[] } =
      await c.req.json();
    if (!league_id || !teamIds.length)
      return c.json({ messg: "Form not valid" }, 403);
    const newRunningLeague = await prisma.$transaction(
      teamIds.map((item) =>
        prisma.runningLeague.create({ data: { league_id, team_id: item } })
      )
    );
    return c.json({ newRunningLeague });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

// runningleagues.put("/:id", async (c) => {
//   try {
//     const token = c.req.header("Bearer");

//     if (!token) return c.json({ messg: "Unauthorized" }, 401);

//     const { role } = await verify(token, process.env.JWT_SECRET!);
//     if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
//     const { id, name }: { id: string; name: string } = await c.req.json();
//     const updatedLeague = await prisma.runningLeague.update({
//       where: { id },
//       data: { name },
//     });
//     return c.json({ updatedLeague });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ messg: "Error" }, { status: 405 });
//   }
// });

// runningleagues.delete("/:id", async (c) => {
//   try {
//     const token = c.req.header("Bearer");

//     if (!token) return c.json({ messg: "Unauthorized" }, 401);

//     const { role } = await verify(token, process.env.JWT_SECRET!);
//     if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
//     const { id } = c.req.param();
//     const deletedLeague = await prisma.runningLeague.update({
//       where: { id },
//       data: { is_archived: true },
//     });
//     return c.json({ deletedLeague });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ messg: "Error" }, { status: 405 });
//   }
// });

export default runningleagues;
