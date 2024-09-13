import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import api from "./routes/api";
import { createBunWebSocket } from "hono/bun";
import { WSContext } from "hono/ws";
import { bondesLigaTeams } from "./data/bondesliga-teams";
import { BondesligaMatches } from "./data/bondesliga-matches";
import { $Enums } from "@prisma/client";
import { prisma } from "../db/prisma";
import { ChampionshipMatches, ChampionshipTeams } from "./data/championship";
import { EredivisieMatches, EredivisieTeams } from "./data/eredivisie";
import { LeagueOneTeams } from "./data/league-1-teams";
import { LeagueOneMatches } from "./data/league-1-matches";
import { PremiereLeagueteams } from "./data/premierleague-teams";
import { matches } from "./libs/data";
import { premeiaLigaTeams } from "./data/premeira-liga-teams";
import { PrimeiraLigaMatches } from "./data/primeira-liga-matches";
import {
  PrimeraDivisionTeams,
  PrimraDivisionMatches,
} from "./data/primera-devision";
import { seriesAMatches, seriesATeams } from "./data/series-a";

const { websocket, upgradeWebSocket } = createBunWebSocket();

interface OnlineUser {
  userId: string;
}

let userSocketMap: string[] = [];

const app = new Hono().use(logger());
const admin = "admin";

app.get("/test", async (c) => {
  //Countries and leagues
  // const existCountries = await prisma.countries.findMany();
  // const validLeaguesData = leagues.map((item) => ({
  //   country_id: existCountries.find(
  //     (country) => country.code === item.area.code
  //   )?.id as string,
  //   name: item.name,
  //   code: item.code,
  //   type: item.type,
  //   image_url: item.emblem,
  // }));
  // const data = await createLeagues(validLeaguesData);

  //Team Create
  const homeTeams = seriesATeams.map((item) => ({
    name: item.name,
    shortName: item.shortName,
    tla: item.tla,
    image_url: item.crest,
    address: item.address,
    website: item.website || "",
    founded: item.founded || 0,
    venue: item.venue || "",
    clubColors: item.clubColors || "",
  }));
  const createTeams = await prisma.$transaction(
    homeTeams.map((item) => prisma.teams.create({ data: item }))
  );
  // const existTeams = await prisma.teams.findMany();

  // Create Matches
  const dataMatches = seriesAMatches.map((match) => ({
    home_team_id: createTeams.find(
      (team) => team.tla.toLowerCase() === match.homeTeam.tla.toLowerCase()
    )?.id as string,
    away_team_id: createTeams.find(
      (team) => team.name.toLowerCase() === match.awayTeam.name.toLowerCase()
    )?.id as string,
    match_date: match.utcDate,
    match_status: match.status as $Enums.Match_Status,
    home_team_score: Number(match.score.fullTime.home),
    away_team_scroe: Number(match.score.fullTime.away),
    league_code: match.competition.code,
  }));
  const createMatches = await prisma.matches.createMany({ data: dataMatches });

  // Squad Team Person
  const validTeams = seriesATeams.map((item) => ({
    id: createTeams.find((exteam) => exteam.tla === item.tla)?.id,
    tla: item.tla,
    name: item.shortName,
    squad: item.squad,
  }));
  const create = async (tla: string) => {
    const team = validTeams.find((item) => item.tla === tla);
    if (!team) return c.json({ messg: "team error" }, 416);
    const createdSquad = await prisma.squad.create({
      data: { name: team.name, team_id: String(team.id) },
    });
    const createdPerson = await prisma.$transaction(
      team.squad.map((item) =>
        prisma.person.create({
          data: {
            name: item.name,
            date_of_birth: String(item.dateOfBirth),
            position: item.position,
            nationality: item.nationality,
          },
        })
      )
    );
    const newPersonIds = createdPerson.map((item) => ({
      person_id: item.id,
      squad_id: createdSquad.id,
    }));
    await prisma.squadMember.createMany({ data: newPersonIds });
    // const createPerson = await prisma.$transaction(filterTeams.map(item => prisma.person.createMany({data:item})))
    console.log(newPersonIds);
  };
  validTeams.map((item) => create(item.tla));

  return c.json({ createMatches });
});

const clients = new Map<string, WSContext>(); // Key: userId, Value: WebSocket
const admins = new Map<string, WSContext>(); // Key: userId, Value: WebSocket

// Function to broadcast a message to all users
const broadcastToAll = (message: object, excludeWs?: WSContext) => {
  const messageString = JSON.stringify(message);
  console.log(messageString);
  clients.forEach((ws) => {
    if (ws !== excludeWs) ws.send(messageString);
  });
  admins.forEach((ws) => {
    if (ws !== excludeWs) ws.send(messageString);
  });
};

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    const urlParams = new URLSearchParams(c.req.url.split("?")[1]);
    const userType = urlParams.get("type"); // 'client' or 'admin'
    const userId = urlParams.get("userId");
    // console.log(urlParams);
    return {
      onOpen(evt, ws) {
        if (userType === "client") {
          clients.set(userId!, ws);
          console.log(`Client connected: ${userId}`);
        } else if (userType === "admin") {
          admins.set(userId!, ws);
          console.log(`Admin connected: ${userId}`);
        }

        // Notify others that a new user is online
        broadcastToAll({ type: "user-online", userId, userType });

        // Send the current list of online users to the newly connected user
        const onlineClients = Array.from(clients.keys());
        const onlineAdmins = Array.from(admins.keys());
        ws.send(
          JSON.stringify({ type: "online-users", onlineClients, onlineAdmins })
        );
      },

      onMessage(event, ws) {
        try {
          // Parse the incoming message from WebSocket
          const data: {
            type: string;
            senderId: string;
            message: string;
            receiverId: string;
            sendTo: string;
          } = JSON.parse(event.data as string);

          if (data.sendTo === "client") {
            if (data.type === "publishmatch") {
              ws.send(
                JSON.stringify({
                  type: "publishmatch",
                  message: data.message,
                })
              );
            } else if (data.type === "betstatus" && admins.has(data.senderId)) {
              const targetClientWs = clients.get(data.receiverId);
              if (targetClientWs) {
                targetClientWs.send(
                  JSON.stringify({ type: data.type, message: data.message })
                );
              }
            } else if (
              data.type === "customerstatus" &&
              admins.has(data.senderId)
            ) {
              const targetClientWs = clients.get(data.receiverId);
              if (targetClientWs) {
                targetClientWs.send(
                  JSON.stringify({ type: data.type, message: data.message })
                );
              }
            } else {
              clients.forEach((clientWs) =>
                clientWs.send(
                  JSON.stringify({
                    type: data.type,
                    message: data.message,
                  })
                )
              );
            }
          } else if (
            data.sendTo === "singleclient" &&
            admins.has(data.senderId)
          ) {
            const targetClientWs = clients.get(data.receiverId);
            if (targetClientWs) {
              targetClientWs.send(
                JSON.stringify({ type: data.type, message: data.message })
              );
            }
          } else if (data.sendTo === "admin" && clients.has(data.senderId)) {
            const targetAdminWs = admins.get(data.receiverId);
            if (targetAdminWs) {
              targetAdminWs.send(
                JSON.stringify({
                  type: data.type,

                  message: data.message,
                })
              );
            }
            // else if (
            //   data.type === "client-message" &&
            //   clients.has(data.senderId)
            // ) {
            //   // Handle client messages here
            //   console.log(
            //     `Client Message from ${data.senderId}: ${data.message}`
            //   );
            //   // Optionally broadcast the message to admins
            //   // ws.send(JSON.stringify({ type: "admin", message: data.message }));
            //   admins.forEach((adminWs) =>
            //     adminWs.send(
            //       JSON.stringify({
            //         type: "admin",
            //         senderId: data.senderId,
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "admin-message") {
            //   // Handle admin messages here
            //   console.log(`Admin Message from ${data.senderId}: ${data.message}`);
            //   // Optionally broadcast the message to clients
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: data.type,
            //         senderId: data.senderId,
            //         message: data.message,
            //         reciverId: data.reciverId,
            //       })
            //     )
            //   );
            // } else if (data.type === "creatematch") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "creatematch",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "publishmatch") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "publishmatch",
            //         message: data.message,
            //       })
            //     )
            //   );
            //   ws.send(
            //     JSON.stringify({
            //       type: "publishmatch",
            //       message: data.message,
            //     })
            //   );
            // } else if (data.type === "newbettingmarket") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "newbettingmarket",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "editbettingmarket") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "editbettingmarket",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "deleteBettingMarket") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "deleteBettingMarket",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "newodd") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "newodd",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "editodd") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "editodd",
            //         message: data.message,
            //       })
            //     )
            //   );
            // } else if (data.type === "deleteodd") {
            //   clients.forEach((clientWs) =>
            //     clientWs.send(
            //       JSON.stringify({
            //         type: "deleteodd",
            //         message: data.message,
            //       })
            //     )
            //   );
            // }
          }
        } catch (err) {
          console.error("Invalid message format received:", event.data);
        }
      },

      // onMessage(event, ws) {
      //   const data: {
      //     type: string;
      //     senderId: string;
      //     content: string;
      //     reciverId: string;
      //   } = JSON.parse(event.data as string);
      //   console.log(data);
      //   if (data.type === "onclick") {
      //     ws.send(JSON.stringify({ type: "sendtoclient", message: "hello" }));
      //   }
      //   if (data.type === "client-message" && clients.has(data.senderId)) {
      //     // Handle client message and send to admins
      //     if (data.reciverId) {
      //       const admin = admins.get(data.reciverId);
      //       if (admin) {
      //         admin.send(
      //           JSON.stringify({
      //             from: "client",
      //             senderId: data.senderId,
      //             message: data.content,
      //           })
      //         );
      //       }
      //     } else {
      //       // Broadcast to all admins
      //       admins.forEach((adminWs) => {
      //         adminWs.send(
      //           JSON.stringify({
      //             from: "client",
      //             senderId: data.senderId,
      //             message: data.content,
      //           })
      //         );
      //       });
      //     }
      //   } else if (data.type === "admin-message" && admins.has(data.senderId)) {
      //     // Handle admin message and send to clients
      //     if (data.reciverId) {
      //       const client = clients.get(data.reciverId);
      //       if (client) {
      //         client.send(
      //           JSON.stringify({
      //             type: "admin",
      //             senderId: data.senderId,
      //             message: data.content,
      //           })
      //         );
      //       }
      //     } else {
      //       // Broadcast to all clients
      //       clients.forEach((clientWs) => {
      //         clientWs.send(
      //           JSON.stringify({
      //             type: "admin",
      //             senderId: data.senderId,
      //             message: data.content,
      //           })
      //         );
      //       });
      //     }
      //   }
      // },

      onClose(ws) {
        if (userType === "client") {
          clients.delete(userId!);
          console.log(`Client disconnected: ${userId}`);
        } else if (userType === "admin") {
          admins.delete(userId!);
          console.log(`Admin disconnected: ${userId}`);
        }

        // Notify others that the user has gone offline
        broadcastToAll({ type: "user-offline", userId, userType });
      },
    };
  })
);

app.route("/api", api).use(cors());

app.use("*", serveStatic({ root: "./frontend/dist" }));

app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

const server = Bun.serve({
  port: process.env.NODE_ENV || 3000,
  fetch: app.fetch,
  websocket,
});

console.log(`Listening on ${server.hostname}:${server.port}`);
