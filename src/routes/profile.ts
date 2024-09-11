import { Hono } from "hono";
import { verify } from "hono/jwt";
import { prisma } from "../../db/prisma";

const profile = new Hono();

profile.post("/socialmedia", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const {
      user_id,
      urls,
    }: {
      user_id: string;
      urls?: {
        value: string;
        name: string;
      }[];
    } = await c.req.json();
    const existUser = await prisma.user.findFirst({ where: { id: user_id } });
    if (!existUser) return c.json({ messg: "User does not exist" }, 403);
    if (!urls?.length) return c.json({ messg: "Form not valid" }, 403);

    const newSocialMediaLink = await prisma.$transaction(
      urls?.map((url) =>
        prisma.socialMediaLink.create({
          data: { user_id, name: url.name, link: url.value },
        })
      )
    );
    return c.json({ newSocialMediaLink });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

export default profile;
