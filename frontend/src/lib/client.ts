import { Match, RunningLeague } from "@/types/types";

export const formatted = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const nextMatches = ({ matches }: { matches: Match[] }) => {
  const now: Date = new Date();
  const eighDaysAhead: Date = new Date();
  eighDaysAhead.setDate(now.getDate() + 8);
  return matches.filter((match) => {
    const matchDate = new Date(match.match_date);
    return matchDate >= now && matchDate <= eighDaysAhead;
  });
};

export const runningLeagueIds = (runningLeagues: RunningLeague[]) => {
  return runningLeagues.reduce(
    (acc: RunningLeague[], current: RunningLeague) => {
      const ids = acc.map((item) => item.league_id);
      if (!ids.includes(current.league_id)) {
        acc.push(current);
      }
      return acc;
    },
    []
  );
  // .map((item) => item.league_id);
};
