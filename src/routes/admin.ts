import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const admin = new Hono();

admin.get("/app/:adminId", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    const { adminId } = c.req.param();
    if (role === "SUPERADMIN") {
      const bets = await prisma.bets.findMany();
      const activeUsers = await prisma.user.findMany({
        where: { account_status: "ACTIVE" },
      });
      const transations = await prisma.transactions.findMany();

      return c.json({
        bets,
        users: activeUsers.map((item) => ({
          id: item.id,
          username: item.username,
          email: item.email,
          balance: item.balance,
          account_status: item.account_status,
        })),
        transations,
      });
    } else if (role === "ADMIN") {
      const bets = await prisma.bets.findMany({ where: { admin_id: adminId } });
      const activeUsers = await prisma.user.findMany({
        where: { account_status: "ACTIVE" },
      });
      const transations = await prisma.transactions.findMany({
        where: { payments: { admin_id: adminId } },
      });

      const payments = await prisma.payment.findMany({
        where: { admin_id: adminId },
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
        transations,
        payments,
      });
    }
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

export default admin;
