import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { bodyLimit } from "hono/body-limit";
import { prisma } from "../../db/prisma";
import { sign } from "hono/jwt";
import leagues from "./leagues";
import countries from "./countries";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../libs/firebase";
import teams from "./teams";
import matches from "./matches";
import bettingMarkets from "./bettingmarkets";

const api = new Hono().use(prettyJSON());

api.get("/appData", async (c) => {
  try {
    const leagues = await prisma.leagues.findMany();
    const countries = await prisma.countries.findMany();
    const teams = await prisma.teams.findMany();
    const matches = await prisma.matches.findMany({
      orderBy: { created_at: "desc" },
    });
    const bettingMarkets = await prisma.bettingMarkets.findMany();
    return c.json({ leagues, countries, teams, matches, bettingMarkets });
  } catch (err) {
    return c.json({ messg: "Error" }, 405);
  }
});

api.route("/leagues", leagues);
api.route("/countries", countries);
api.route("/teams", teams);
api.route("/matches", matches);
api.route("/bettingmarkets", bettingMarkets);

api.post("/login", async (c) => {
  try {
    const { email, password }: { email: string; password: string } =
      await c.req.json();
    if (!email || !password) return c.json({ messg: "Form not valid" }, 403);
    // console.log(email, password);
    const existEmail = await prisma.user.findUnique({ where: { email } });
    // console.log(existEmail);
    if (!existEmail) return c.json({ messg: "Email does not exist" }, 403);
    const validPassword = Bun.password.verifySync(
      password,
      existEmail.password_hash
    );
    // console.log(validPassword);

    if (!validPassword) return c.json({ messg: "Wrong Password" }, 403);

    const payload = {
      sub: existEmail.id,
      role: existEmail.user_role,
      exp: Math.floor(Date.now() / 1000) + 60 * 500, // Token expires in 5 minutes
    };
    const secret = "mySecretKey";
    const token = await sign(payload, secret);
    // console.log(token);
    const user = {
      id: existEmail.id,
      username: existEmail.username,
      email: existEmail.email,
      balance: existEmail.balance,
    };
    return c.json({ user, token });
  } catch (err) {
    return c.json({ messg: "error" }, 405);
  }
});

api.post("/register", async (c) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = await c.req.json();
  try {
    if (!username || !email || !password)
      return c.json({ messg: "Form not valid", status: 405 });
    const password_hash = Bun.password.hashSync(password);
    await prisma.user.create({ data: { username, email, password_hash } });

    return c.json({ messg: "Account created Successful", status: 200 });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "error" });
  }
});

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

api.post(
  "/upload",
  bodyLimit({
    maxSize: 50 * 102400, // 50kb
    onError: (c) => {
      return c.text("overflow :(", 413);
    },
  }),
  async (c) => {
    try {
      const body = (await c.req.formData()).get("file");
      console.log(body);
      const uniqueNumber = generateRandomNumber(100, 9999);

      const imageRef = ref(storage, `images/${uniqueNumber}`);
      const bookUrl = await uploadBytesResumable(imageRef, body as Blob);
      const image_url = await getDownloadURL(imageRef);
      // console.log(image_url);
      return c.json({ image_url }, 200);
    } catch (err) {
      console.log(err);
      return c.json({ messg: "Error" }, 403);
    }
  }
);

export type ApiType = typeof api;
export default api;
