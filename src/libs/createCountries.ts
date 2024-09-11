import { prisma } from "../../db/prisma";

export const createCountries = async () => {
  await prisma.countries.createMany({
    data: [
      {
        name: "Portugal",
        code: "POR",
        flag: "https://crests.football-data.org/765.svg",
      },
      {
        name: "England",
        code: "ENG",
        flag: "https://crests.football-data.org/770.svg",
      },
      {
        name: "Netherlands",
        code: "NLD",
        flag: "https://crests.football-data.org/8601.svg",
      },
      {
        name: "Germany",
        code: "DEU",
        flag: "https://crests.football-data.org/759.svg",
      },
      {
        name: "France",
        code: "FRA",
        flag: "https://crests.football-data.org/773.svg",
      },
      {
        name: "Italy",
        code: "ITA",
        flag: "https://crests.football-data.org/784.svg",
      },
      {
        name: "Spain",
        code: "ESP",
        flag: "https://crests.football-data.org/760.svg",
      },
      {
        name: "Brazil",
        code: "BRA",
        flag: "https://crests.football-data.org/764.svg",
      },
      {
        name: "Europe",
        code: "EUR",
        flag: "https://crests.football-data.org/EUR.svg",
      },
    ],
  });
};

export const createLeague = async ({
  country_id,
  code,
  name,
  type,
  emblem,
}: {
  country_id: string;
  name: string;
  code: string;
  type: string;
  emblem: string;
}) => {
  try {
    await prisma.leagues.create({
      data: { country_id, code, name, type, image_url: emblem },
    });
    return { messg: "successful" };
  } catch (err) {
    console.log(err);
    return { messg: "Error" };
  }
};

export const createLeagues = async (
  data: {
    country_id: string;
    name: string;
    code: string;
    type: string;
    image_url: string;
  }[]
) => {
  try {
    await prisma.leagues.createMany({ data });
    console.log("successful");
    return { messg: "successful" };
  } catch (err) {
    console.log(err);
    return { messg: "error" };
  }
};

export const leagues = [
  {
    id: 2013,
    area: {
      id: 2032,
      name: "Brazil",
      code: "BRA",
      flag: "https://crests.football-data.org/764.svg",
    },
    name: "Campeonato Brasileiro Série A",
    code: "BSA",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/bsa.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2257,
      startDate: "2024-04-13",
      endDate: "2024-12-08",
      currentMatchday: 25,
      winner: null,
    },
    numberOfAvailableSeasons: 8,
    lastUpdated: "2024-05-08T14:08:14Z",
  },
  {
    id: 2016,
    area: {
      id: 2072,
      name: "England",
      code: "ENG",
      flag: "https://crests.football-data.org/770.svg",
    },
    name: "Championship",
    code: "ELC",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/ELC.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2301,
      startDate: "2024-08-09",
      endDate: "2025-05-03",
      currentMatchday: 5,
      winner: null,
    },
    numberOfAvailableSeasons: 8,
    lastUpdated: "2022-03-20T09:31:30Z",
  },
  {
    id: 2021,
    area: {
      id: 2072,
      name: "England",
      code: "ENG",
      flag: "https://crests.football-data.org/770.svg",
    },
    name: "Premier League",
    code: "PL",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PL.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2287,
      startDate: "2024-08-16",
      endDate: "2025-05-25",
      currentMatchday: 4,
      winner: null,
    },
    numberOfAvailableSeasons: 126,
    lastUpdated: "2022-03-20T08:58:54Z",
  },
  {
    id: 2001,
    area: {
      id: 2077,
      name: "Europe",
      code: "EUR",
      flag: "https://crests.football-data.org/EUR.svg",
    },
    name: "UEFA Champions League",
    code: "CL",
    type: "CUP",
    emblem: "https://crests.football-data.org/CL.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2350,
      startDate: "2024-09-17",
      endDate: "2025-05-31",
      currentMatchday: 1,
      winner: null,
    },
    numberOfAvailableSeasons: 45,
    lastUpdated: "2022-03-20T09:20:44Z",
  },
  {
    id: 2018,
    area: {
      id: 2077,
      name: "Europe",
      code: "EUR",
      flag: "https://crests.football-data.org/EUR.svg",
    },
    name: "European Championship",
    code: "EC",
    type: "CUP",
    emblem: "https://crests.football-data.org/ec.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 1537,
      startDate: "2024-06-14",
      endDate: "2024-07-14",
      currentMatchday: 7,
      winner: {
        id: 760,
        name: "Spain",
        shortName: "Spain",
        tla: "ESP",
        crest: "https://crests.football-data.org/760.svg",
        address: "Ramón y Cajal, s/n Las Rozas 28230",
        website: "http://www.rfef.es",
        founded: 1909,
        clubColors: "Red / Blue / Yellow",
        venue: "Estadio Alfredo Di Stéfano",
        lastUpdated: "2021-05-26T09:46:48Z",
      },
    },
    numberOfAvailableSeasons: 17,
    lastUpdated: "2024-05-08T14:14:52Z",
  },
  {
    id: 2015,
    area: {
      id: 2081,
      name: "France",
      code: "FRA",
      flag: "https://crests.football-data.org/773.svg",
    },
    name: "Ligue 1",
    code: "FL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/FL1.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2290,
      startDate: "2024-08-18",
      endDate: "2025-05-18",
      currentMatchday: 4,
      winner: null,
    },
    numberOfAvailableSeasons: 81,
    lastUpdated: "2022-03-20T09:30:02Z",
  },
  {
    id: 2002,
    area: {
      id: 2088,
      name: "Germany",
      code: "DEU",
      flag: "https://crests.football-data.org/759.svg",
    },
    name: "Bundesliga",
    code: "BL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/BL1.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2308,
      startDate: "2024-08-23",
      endDate: "2025-05-17",
      currentMatchday: 3,
      winner: null,
    },
    numberOfAvailableSeasons: 62,
    lastUpdated: "2022-03-20T08:52:53Z",
  },
  {
    id: 2019,
    area: {
      id: 2114,
      name: "Italy",
      code: "ITA",
      flag: "https://crests.football-data.org/784.svg",
    },
    name: "Serie A",
    code: "SA",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/SA.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2310,
      startDate: "2024-08-18",
      endDate: "2025-05-25",
      currentMatchday: 4,
      winner: null,
    },
    numberOfAvailableSeasons: 93,
    lastUpdated: "2022-03-20T09:16:43Z",
  },
  {
    id: 2003,
    area: {
      id: 2163,
      name: "Netherlands",
      code: "NLD",
      flag: "https://crests.football-data.org/8601.svg",
    },
    name: "Eredivisie",
    code: "DED",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/ED.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2293,
      startDate: "2024-08-09",
      endDate: "2025-05-18",
      currentMatchday: 5,
      winner: null,
    },
    numberOfAvailableSeasons: 69,
    lastUpdated: "2022-03-20T09:19:27Z",
  },
  {
    id: 2017,
    area: {
      id: 2187,
      name: "Portugal",
      code: "POR",
      flag: "https://crests.football-data.org/765.svg",
    },
    name: "Primeira Liga",
    code: "PPL",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PPL.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2312,
      startDate: "2024-08-11",
      endDate: "2025-05-17",
      currentMatchday: 5,
      winner: null,
    },
    numberOfAvailableSeasons: 76,
    lastUpdated: "2022-03-20T09:34:09Z",
  },
  // {
  //   id: 2152,
  //   area: {
  //     id: 2220,
  //     name: "South America",
  //     code: "SAM",
  //     flag: "https://crests.football-data.org/CLI.svg",
  //   },
  //   name: "Copa Libertadores",
  //   code: "CLI",
  //   type: "CUP",
  //   emblem: "https://crests.football-data.org/CLI.svg",
  //   plan: "TIER_ONE",
  //   currentSeason: {
  //     id: 1644,
  //     startDate: "2024-02-07",
  //     endDate: "2024-08-23",
  //     currentMatchday: 6,
  //     winner: null,
  //   },
  //   numberOfAvailableSeasons: 4,
  //   lastUpdated: "2024-06-20T18:59:19Z",
  // },
  {
    id: 2014,
    area: {
      id: 2224,
      name: "Spain",
      code: "ESP",
      flag: "https://crests.football-data.org/760.svg",
    },
    name: "Primera Division",
    code: "PD",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/laliga.png",
    plan: "TIER_ONE",
    currentSeason: {
      id: 2292,
      startDate: "2024-08-18",
      endDate: "2025-05-25",
      currentMatchday: 5,
      winner: null,
    },
    numberOfAvailableSeasons: 94,
    lastUpdated: "2024-09-02T11:25:45Z",
  },
  // {
  //   id: 2000,
  //   area: {
  //     id: 2267,
  //     name: "World",
  //     code: "INT",
  //     flag: null,
  //   },
  //   name: "FIFA World Cup",
  //   code: "WC",
  //   type: "CUP",
  //   emblem: "https://crests.football-data.org/qatar.png",
  //   plan: "TIER_ONE",
  //   currentSeason: {
  //     id: 1382,
  //     startDate: "2022-11-20",
  //     endDate: "2022-12-18",
  //     currentMatchday: 8,
  //     winner: {
  //       id: 762,
  //       name: "Argentina",
  //       shortName: "Argentina",
  //       tla: "ARG",
  //       crest: "https://crests.football-data.org/762.png",
  //       address: "Viamonte 1366/76 Buenos Aires, Buenos Aires 1053",
  //       website: "http://www.afa.org.ar",
  //       founded: 1893,
  //       clubColors: "Sky Blue / White / Black",
  //       venue: null,
  //       lastUpdated: "2022-05-17T21:09:25Z",
  //     },
  //   },
  //   numberOfAvailableSeasons: 22,
  //   lastUpdated: "2022-05-09T19:45:29Z",
  // },
];
