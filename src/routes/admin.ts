import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const admin = new Hono();
const { upgradeWebSocket } = createBunWebSocket();
admin.get(
  "/",
  upgradeWebSocket((c) => {
    return {
      //   onMessage(event, ws) {
      //     console.log(`Message from client: ${event.data}`);
      //     ws.send("Hello from server!");
      //   },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

admin.get("/app", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const bets = await prisma.bets.findMany();
    const activeUsers = await prisma.user.findMany({
      where: { account_status: "ACTIVE" },
    });

    return c.json({
      bets,
      users: activeUsers.map((item) => ({
        id: item.id,
        username: item.username,
        email: item.email,
        balance: item.balance,
        account_status: item.account_status,
      })),
    });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

export default admin;
