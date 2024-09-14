import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";

const payments = new Hono();

payments.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      name,
      payment_name,
      payment_number,
      admin_id,
    }: {
      name: string;
      payment_name: string;
      payment_number: string;
      admin_id: string;
    } = await c.req.json();
    if (!name || !payment_name || !payment_number || !admin_id)
      return c.json({ messg: "Form not valid" }, 403);
    console.log(payment_number);
    const newPayment = await prisma.payment.create({
      data: { name, payment_name, payment_number, admin_id: admin_id },
    });
    return c.json({ newPayment });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

payments.put("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const {
      id,
      name,
      payment_name,
      payment_number,
    }: {
      id: string;
      name: string;
      payment_name: string;
      payment_number: string;
    } = await c.req.json();
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { name, payment_name, payment_number },
    });
    return c.json({ updatedPayment });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

// payments.delete("/:id", async (c) => {
//   try {
//     const token = c.req.header("Bearer");

//     if (!token) return c.json({ messg: "Unauthorized" }, 401);

//     const { role } = await verify(token, process.env.JWT_SECRET!);
//     if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

//     const { id } = c.req.param();
//     const deletedCountry = await prisma.payment.update({
//       where: { id },
//       data: { is_archived: true },
//     });
//     return c.json({ deletedCountry });
//   } catch (err) {
//     console.log(err);
//     return c.json({ messg: "Error" }, 405);
//   }
// });

export default payments;
