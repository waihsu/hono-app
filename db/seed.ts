import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function Init() {
  try {
    await prisma.countries.createMany({
      data: [
        { name: "England" },
        { name: "Southland" },
        { name: "Wales" },
        { name: "Italy" },
        { name: "Germany" },
        { name: "France" },
        { name: "Natherlands" },
        { name: "Belgium" },
        { name: "Turkey" },
        { name: "Switzerland" },
        { name: "Austria" },
        { name: "Spain" },
        { name: "Portugal" },
        { name: "Hungary" },
        { name: "Russia" },
        { name: "Ukraine" },
        { name: "Poland" },
        { name: "Romania" },
        { name: "Greece" },
        { name: "Crotia" },
        { name: "Bosnia and Herzegovina" },
        { name: "Armenia" },
        { name: "Georgia" },
      ],
    });
    await prisma.leagues.createMany({
      data: [
        { name: "Premier League" },
        { name: "La Liga" },
        { name: "Serie A" },
        { name: "Bundesliga" },
        { name: "Legue 1" },
        { name: "Primeira Liga" },
        { name: "Scottish Premiership" },
        { name: "Ekstraklasa" },
        { name: "Greek Super League" },
        { name: "Super Lig" },
        { name: "Russian Premier League" },
        { name: "UEFA Champions League" },
        { name: "UEFA Europa League" },
      ],
    });
    console.log("success");
  } catch (err) {
    console.log("error");
  }
}

Init();
