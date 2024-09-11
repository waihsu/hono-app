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
import bets from "./bets";
import payments from "./payments";
import transactions from "./transations";
import runningleagues from "./runningleagues";
import profile from "./profile";
import publishmatches from "./publish-matches";

const api = new Hono();

// Routes
api.route("/admin", admin);
api.route("/leagues", leagues);
api.route("/countries", countries);
api.route("/teams", teams);
api.route("/matches", matches);
api.route("/bettingmarkets", bettingMarkets);
api.route("/odds", odds);
api.route("/bets", bets);
api.route("/payments", payments);
api.route("/transactions", transactions);
api.route("/runningleagues", runningleagues);
api.route("/profiles", profile);
api.route("/publish", publishmatches);

// App Data
api.get("/appData/:userId", async (c) => {
  try {
    const { userId } = c.req.param();
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
      where: {
        betting_market_id: { in: bettingMartketIds },
        is_archived: false,
      },
    });
    const payments = await prisma.payment.findMany();
    const admins = await prisma.user.findMany({
      where: { user_role: { not: "USER" } },
    });
    const userBets = await prisma.bets.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    const transactions = await prisma.transactions.findMany({
      where: { user_id: userId },
    });
    const publishMatches = await prisma.publishMatch.findMany();
    const currentUser = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        user_role: true,
        username: true,
        email: true,
        balance: true,
        account_status: true,
      },
    });
    return c.json({
      leagues,
      countries,
      teams,
      matches,
      bettingMarkets,
      odds,
      payments,
      admins: admins.map((item) => ({
        id: item.id,
        username: item.username,
        email: item.email,
        balance: item.balance,
        account_status: item.account_status,
      })),
      userBets,
      transactions,
      currentUser,
      publishMatches,
    });
  } catch (err) {
    console.log(err);
    return c.json({ messg: "Error" }, 405);
  }
});

// Login
api.post("/admin/login", async (c) => {
  try {
    const { email, password }: { email: string; password: string } =
      await c.req.json();
    if (!email || !password) return c.json({ messg: "Form not valid" }, 403);
    // console.log(email, password);
    const existAdmin = await prisma.user.findUnique({
      where: { email, user_role: { not: "USER" } },
    });
    console.log(existAdmin);
    if (!existAdmin) return c.json({ messg: "Email does not exist" }, 403);
    const validPassword = Bun.password.verifySync(
      password,
      existAdmin.password_hash
    );
    // console.log(validPassword);

    if (!validPassword) return c.json({ messg: "Wrong Password" }, 403);

    const payload = {
      sub: existAdmin.id,
      role: existAdmin.user_role,
      exp: Math.floor(Date.now() / 1000) + 60 * 5000, // Token expires in 5 minutes
    };

    const token = await sign(payload, process.env.JWT_SECRET!);
    // console.log(token);
    const user = {
      id: existAdmin.id,
      username: existAdmin.username,
      email: existAdmin.email,
      balance: existAdmin.balance,
      user_role: existAdmin.user_role,
    };
    return c.json({ user, token });
  } catch (err) {
    return c.json({ messg: "error" }, 405);
  }
});

api.post("/user/login", async (c) => {
  try {
    const { email, password }: { email: string; password: string } =
      await c.req.json();
    if (!email || !password) return c.json({ messg: "Form not valid" }, 403);
    // console.log(email, password);
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });

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
      user_role: existEmail.user_role,
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
