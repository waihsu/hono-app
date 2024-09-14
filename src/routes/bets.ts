import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { bearerAuth } from "hono/bearer-auth";
import { jwt, verify } from "hono/jwt";
import { $Enums } from "@prisma/client";

const bets = new Hono();

bets.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const isAuth = await verify(token, process.env.JWT_SECRET!);
    if (!isAuth) return c.json({ messg: "Please Login Again" }, 403);

    const {
      user_id,
      betting_market_id,
      odd_id,
      amount,
      admin_id,
    }: {
      user_id: string;
      betting_market_id: string;
      odd_id: string;
      amount: number;
      admin_id: string;
    } = await c.req.json();
    if (!user_id || !betting_market_id || !odd_id || !amount)
      return c.json({ messg: "Form not valid" }, 403);
    const existUser = await prisma.user.findFirst({
      where: { id: user_id },
      select: { balance: true },
    });
    if (!existUser) return c.json({ messg: "Current user does not exist" });
    const minusAmount = existUser.balance - amount;
    console.log(minusAmount);
    if (minusAmount < 0) return c.json({ messg: "Your money not enough" });
    const currentUserUpdated = await prisma.user.update({
      where: { id: user_id },
      data: { balance: minusAmount },
      select: {
        id: true,
        user_role: true,
        username: true,
        email: true,
        balance: true,
        account_status: true,
      },
    });
    const newBet = await prisma.bets.create({
      data: { amount, betting_market_id, odd_id, user_id, admin_id },
    });
    // console.log(newBet);
    return c.json({ newBet, currentUserUpdated });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

bets.put("/status", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const isAuth = await verify(token, process.env.JWT_SECRET!);
    if (!isAuth) return c.json({ messg: "Please Login Again" }, 418);
    const { betId, status }: { betId: string; status: $Enums.Bet_Status } =
      await c.req.json();
    if (!betId || !status) return c.json({ messg: "Form not valid" }, 403);

    const updatedBet = await prisma.bets.update({
      where: { id: betId },
      data: { bet_status: status },
    });
    return c.json({ updatedBet });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

// bets.put("/:id", async (c) => {
//   try {
//     const token = c.req.header("Bearer");

//     if (!token) return c.json({ messg: "Unauthorized" }, 401);

//     const { role } = await verify(token, process.env.JWT_SECRET!);
//     if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
//     const { id, name }: { id: string; name: string } = await c.req.json();
//     const updatedLeague = await prisma.bets.update({
//       where: { id },
//       data: { name },
//     });
//     return c.json({ updatedLeague });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ messg: "Error" }, { status: 405 });
//   }
// });

// bets.delete("/:id", async (c) => {
//   try {
//     const token = c.req.header("Bearer");

//     if (!token) return c.json({ messg: "Unauthorized" }, 401);

//     const { role } = await verify(token, process.env.JWT_SECRET!);
//     if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
//     const { id } = c.req.param();
//     const deletedLeague = await prisma.bets.update({
//       where: { id },
//       data: { is_archived: true },
//     });
//     return c.json({ deletedLeague });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ messg: "Error" }, { status: 405 });
//   }
// });

export default bets;
