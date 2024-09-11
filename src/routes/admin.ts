import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { $Enums } from "@prisma/client";

const admin = new Hono();

admin.get("/:adminId", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorizedjj" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    const { adminId } = c.req.param();
    if (role === "SUPERADMIN") {
      const admins = await prisma.user.findMany({
        where: { user_role: "ADMIN" },
      });
      const leagues = await prisma.leagues.findMany({
        where: { is_archived: false },
      });
      const countries = await prisma.countries.findMany({
        where: { is_archived: false },
      });
      const teams = await prisma.teams.findMany({
        where: { is_archived: false },
      });
      const runningLeagues = await prisma.runningLeague.findMany();
      const matches = await prisma.matches.findMany({
        where: { is_archived: false },
      });
      const bettingMarkets = await prisma.bettingMarkets.findMany({
        where: { is_archived: false },
      });
      const bettingMartketIds = bettingMarkets.map((item) => item.id);
      const odds = await prisma.odds.findMany({
        where: {
          betting_market_id: { in: bettingMartketIds },
          is_archived: false,
        },
      });
      const payments = await prisma.payment.findMany();
      const bets = await prisma.bets.findMany();
      const activeUsers = await prisma.user.findMany();
      const transations = await prisma.transactions.findMany();
      const socialMediaLinks = await prisma.socialMediaLink.findMany({
        where: { user_id: adminId },
      });
      const publishMatches = await prisma.publishMatch.findMany({
        where: { user_id: adminId },
      });

      return c.json({
        leagues,
        runningLeagues,
        countries,
        teams,
        matches,
        bettingMarkets,
        odds,
        payments,
        bets,
        users: activeUsers
          .map((item) => ({
            id: item.id,
            username: item.username,
            email: item.email,
            balance: item.balance,
            account_status: item.account_status,
            user_role: item.user_role,
          }))
          .filter((user) => user.user_role !== "SUPERADMIN"),
        transations,
        socialMediaLinks,
        publishMatches,
      });
    } else if (role === "ADMIN") {
      const leagues = await prisma.leagues.findMany({
        where: { is_archived: false },
      });
      const countries = await prisma.countries.findMany({
        where: { is_archived: false },
      });
      const teams = await prisma.teams.findMany({
        where: { is_archived: false },
      });
      const runningLeagues = await prisma.runningLeague.findMany();
      const matches = await prisma.matches.findMany({
        where: { is_archived: false },
      });
      const publishMatches = await prisma.publishMatch.findMany({
        where: { user_id: adminId },
      });
      const bettingMarkets = await prisma.bettingMarkets.findMany({
        where: { is_archived: false },
      });
      const bettingMartketIds = bettingMarkets.map((item) => item.id);
      const odds = await prisma.odds.findMany({
        where: {
          betting_market_id: { in: bettingMartketIds },
          is_archived: false,
        },
      });
      const bets = await prisma.bets.findMany({ where: { admin_id: adminId } });
      const activeUsers = await prisma.user.findMany({
        where: { account_status: "ACTIVE", user_role: { equals: "USER" } },
      });
      const transations = await prisma.transactions.findMany({
        where: { payments: { admin_id: adminId } },
      });

      const payments = await prisma.payment.findMany({
        where: { admin_id: adminId },
      });

      return c.json({
        leagues,
        runningLeagues,
        countries,
        teams,
        matches,
        bets,
        bettingMarkets,
        odds,
        users: activeUsers.map((item) => ({
          id: item.id,
          username: item.username,
          email: item.email,
          balance: item.balance,
          account_status: item.account_status,
        })),
        transations,
        payments,
        publishMatches,
      });
    }
    return c.json({ messg: "You are not admin" }, 403);
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

admin.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorizedjj" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "SUPERADMIN")
      return c.json({ messg: "You are not admin" }, 403);
    const { superAdminId, email }: { superAdminId: string; email: string } =
      await c.req.json();
    const existAdmin = await prisma.user.findFirst({
      where: { id: superAdminId },
    });
    if (!existAdmin) return c.json({ messg: "You are not admin" }, 403);
    const existUser = await prisma.user.findFirst({ where: { email: email } });
    if (!existUser) return c.json({ messg: "User does not exist" }, 403);
    const userToAdmin = await prisma.user.update({
      where: { email },
      data: { user_role: "ADMIN" },
    });
    return c.json({
      createdAdmin: {
        id: userToAdmin.id,
        username: userToAdmin.username,
        email: userToAdmin.email,
        user_role: userToAdmin.user_role,
        account_status: userToAdmin.account_status,
        balance: userToAdmin.balance,
      },
    });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

admin.put("/userstatus/:adminId", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorizedjj" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "SUPERADMIN")
      return c.json({ messg: "You are not admin" }, 403);
    const { adminId } = c.req.param();
    const {
      userId,
      account_status,
    }: { userId: string; account_status: $Enums.AccountStatusType } =
      await c.req.json();
    if (!adminId || !userId || !account_status)
      return c.json({ messg: "Form not valid" }, 403);
    const isSuperAdmin = await prisma.user.findFirst({
      where: { id: adminId, user_role: "SUPERADMIN" },
    });
    if (!isSuperAdmin) return c.json({ messg: "You are not admin" }, 403);
    const updatedUserStatus = await prisma.user.update({
      where: { id: userId },
      data: { account_status },
    });
    return c.json({
      updatedUserStatus: {
        id: updatedUserStatus.id,
        username: updatedUserStatus.username,
        email: updatedUserStatus.email,
        user_role: updatedUserStatus.user_role,
        account_status: updatedUserStatus.account_status,
        balance: updatedUserStatus.balance,
      },
    });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 403);
  }
});

admin.delete("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorizedjj" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "SUPERADMIN")
      return c.json({ messg: "You are not admin" }, 403);
    const { superAdminId, userId }: { superAdminId: string; userId: string } =
      await c.req.json();
    const existAdmin = await prisma.user.findFirst({
      where: { id: superAdminId },
    });
    if (!existAdmin) return c.json({ messg: "You are not admin" }, 403);
    const existUser = await prisma.user.findFirst({
      where: { id: userId, user_role: "ADMIN" },
    });
    if (!existUser) return c.json({ messg: "User does not exist" }, 403);
    const removedAdmin = await prisma.user.update({
      where: { id: userId },
      data: { user_role: "USER" },
    });
    return c.json({
      removedAdmin: {
        id: removedAdmin.id,
        username: removedAdmin.username,
        email: removedAdmin.email,
        user_role: removedAdmin.user_role,
        account_status: removedAdmin.account_status,
        balance: removedAdmin.balance,
      },
    });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Server Error" }, 405);
  }
});

export default admin;
