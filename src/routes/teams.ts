import { Hono } from "hono";
import { prisma } from "../../db/prisma";
import { verify } from "hono/jwt";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../libs/firebase";
import { uploadImage } from "../libs/uploadImage";

const teams = new Hono();

teams.post("/", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const file = (await c.req.formData()).get("file");
    const name = (await c.req.formData()).get("name") as string;
    const shortName = (await c.req.formData()).get("shortName") as string;
    const address = (await c.req.formData()).get("address") as string;
    const tla = (await c.req.formData()).get("tla") as string;
    const website = (await c.req.formData()).get("website") as string;
    const founded = (await c.req.formData()).get("founded") as string;
    const venue = (await c.req.formData()).get("venue") as string;
    const clubColors = (await c.req.formData()).get("clubColors") as string;

    if (!name || !shortName || !tla || !clubColors || !file || !venue)
      return c.json({ messg: "Form not valid" }, 403);
    console.log(founded);
    if (!Number(founded))
      return c.json({ messg: "Founded must be number" }, 418);
    const image_url = await uploadImage({
      blob: file as Blob,
      name: name,
    });
    if (!image_url) return c.json({ messg: "Image Upload Error" }, 403);
    // console.log(image_url, name, country_id, league_id);

    const newTeam = await prisma.teams.create({
      data: {
        name,
        shortName,
        tla,
        image_url,
        address,
        website,
        founded: Number(founded),
        venue,
        clubColors,
      },
    });
    return c.json({ newTeam });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 403);
  }
});

teams.put("/:teamId", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);

    const { teamId } = c.req.param();
    if (!teamId) return c.json({ messg: "Not found Team Id" });
    const file = (await c.req.formData()).get("file");
    const image_url = (await c.req.formData()).get("image_url") as string;
    const name = (await c.req.formData()).get("name") as string;
    const shortName = (await c.req.formData()).get("shortName") as string;
    const address = (await c.req.formData()).get("address") as string;
    const tla = (await c.req.formData()).get("tla") as string;
    const website = (await c.req.formData()).get("website") as string;
    const founded = (await c.req.formData()).get("founded") as string;
    const venue = (await c.req.formData()).get("venue") as string;
    const clubColors = (await c.req.formData()).get("clubColors") as string;
    const isFoundedNumber = Number(founded);
    if (!isFoundedNumber) return c.json({ messg: "Founded must be number" });
    if (!file) {
      const updatedTeam = await prisma.teams.update({
        where: { id: teamId },
        data: {
          name,
          shortName,
          tla,
          address,
          website,
          image_url,
          founded: isFoundedNumber,
          venue,
          clubColors,
        },
      });
      return c.json({ updatedTeam });
    }
    const newImage_url = await uploadImage({
      blob: file as Blob,
      name: name,
    });
    const updatedTeam = await prisma.teams.update({
      where: { id: teamId },
      data: {
        name,
        shortName,
        tla,
        address,
        website,
        image_url: newImage_url,
        founded: isFoundedNumber,
        venue,
        clubColors,
      },
    });
    return c.json({ updatedTeam });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

teams.delete("/:id", async (c) => {
  try {
    const token = c.req.header("Bearer");

    if (!token) return c.json({ messg: "Unauthorized" }, 401);

    const { role } = await verify(token, process.env.JWT_SECRET!);
    if (role === "USER") return c.json({ messg: "You are not admin" }, 401);
    const { id } = c.req.param();
    const deletedTeam = await prisma.teams.update({
      where: { id },
      data: { is_archived: true },
    });
    return c.json({ deletedTeam });
  } catch (err) {
    console.log(err);
    return Response.json({ messg: "Error" }, { status: 405 });
  }
});

export default teams;
