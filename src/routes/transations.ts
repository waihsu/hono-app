import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { $Enums } from "@prisma/client";

const transactions = new Hono();

transactions.post("/deposit", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role !== "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      user_id,
      payment_id,
      amount,
      phone_number,
      name,
      transfer_id,
    }: {
      user_id: string;
      payment_id: string;
      amount: string;
      phone_number: string;
      name: string;
      transfer_id: string;
    } = await c.req.json();
    if (
      !name ||
      !user_id ||
      !payment_id ||
      !amount ||
      !phone_number ||
      !transfer_id
    )
      return c.json({ messg: "Form not valid" }, 403);

    const newTransation = await prisma.transactions.create({
      data: {
        amount: Number(amount),
        payment_id,
        phone_number,
        transfer_id,
        name,
        user_id,
        transaction_type: "DEPOSIT",
      },
    });
    return c.json({ newTransation });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

transactions.put("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      transationId,
      status,
    }: { transationId: string; status: $Enums.Transation_Status } =
      await c.req.json();
    if (!transationId || !status)
      return c.json({ mesg: "Form not valid" }, 418);
    const existTransaction = await prisma.transactions.findUnique({
      where: { id: transationId },
    });
    if (!existTransaction)
      return c.json({ messg: "This transaction does not exist" }, 418);
    const existUserBalance = await prisma.user.findFirst({
      where: { id: existTransaction.user_id },
      select: { balance: true },
    });
    if (!existUserBalance)
      return c.json({ messg: "User Balance does not exist" }, 418);

    if (status === "COMPLETED") {
      const updatedTransatrion = await prisma.transactions.update({
        where: { id: transationId },
        data: { transation_status: "COMPLETED" },
      });
      const plusedBalance = existUserBalance.balance + existTransaction.amount;
      if (!plusedBalance) return c.json({ messg: "Update Balance Error" }, 418);
      const updatedBalence = await prisma.user.update({
        where: { id: existTransaction.user_id },
        data: { balance: plusedBalance },
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
          account_status: true,
          user_role: true,
        },
      });
      return c.json({ updatedBalence });
    }
    const updatedTransatrion = await prisma.transactions.update({
      where: { id: transationId },
      data: { transation_status: status },
    });
    return c.json({ messg: "Updated" }, 418);
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

transactions.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { id } = c.req.param();
    const deletedCountry = await prisma.transactions.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedCountry });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

export default transactions;
