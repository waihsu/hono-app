import { Hono } from "hono";
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
import odds from "./odds";
import admin from "./admin";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";

const { websocket, upgradeWebSocket } = createBunWebSocket();

const topic = "public";

const api = new Hono();

api.get("/appData", async (c) => {
  try {
    const leagues = await prisma.leagues.findMany({
      where: { is_archived: false },
    });
    const countries = await prisma.countries.findMany({
      where: { is_archived: false },
    });
    const teams = await prisma.teams.findMany({
      where: { is_archived: false },
    });
    const matches = await prisma.matches.findMany({
      orderBy: { created_at: "desc" },
      where: { is_archived: false },
    });
    const bettingMarkets = await prisma.bettingMarkets.findMany({
      where: { is_archived: false },
    });
    const bettingMartketIds = bettingMarkets.map((item) => item.id);
    const odds = await prisma.odds.findMany({
      where: { betting_market_id: { in: bettingMartketIds } },
    });
    return c.json({ leagues, countries, teams, matches, bettingMarkets, odds });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

// Routes
api.route("/admin", admin);
api.route("/leagues", leagues);
api.route("/countries", countries);
api.route("/teams", teams);
api.route("/matches", matches);
api.route("/bettingmarkets", bettingMarkets);
api.route("/odds", odds);

// Login
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
      exp: Math.floor(Date.now() / 1000) + 60 * 5000, // Token expires in 5 minutes
    };

    const token = await sign(payload, process.env.JWT_SECRET!);
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

// Register
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

// Image Upload
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
