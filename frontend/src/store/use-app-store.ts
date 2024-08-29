import { toast } from "@/components/ui/use-toast";
import {
  BettingMarket,
  Country,
  League,
  Match,
  Odd,
  Team,
} from "@/types/types";
import { create } from "zustand";

interface AppState {
  getAppData: () => void;

  //Countries
  countries: Country[];
  // setCountry: (country: Country[]) => void;
  addCountry: (Country: Country) => void;
  updateCountry: (Country: Country) => void;
  removeCountry: (Country: Country) => void;

  //Leagues
  leagues: League[];
  // setLeagues: (leagues: League[]) => void;
  addLeague: (league: League) => void;
  updateLeague: (league: League) => void;
  removeLeague: (league: League) => void;

  //Teams
  teams: Team[];
  addTeam: (Team: Team) => void;
  updateTeam: (Team: Team) => void;
  removeTeam: (Team: Team) => void;

  //Matches
  matches: Match[];
  addMatch: (Match: Match) => void;
  updateMatch: (Match: Match) => void;
  removeMatch: (Match: Match) => void;

  //Betting Markets
  bettingMarkets: BettingMarket[];
  addBettingMarket: (BettingMarket: BettingMarket) => void;
  updateBettingMarket: (BettingMarket: BettingMarket) => void;
  removeBettingMarket: (BettingMarket: BettingMarket) => void;

  //Odds
  odds: Odd[];
  addOdd: (Odd: Odd) => void;
  updateOdd: (Odd: Odd) => void;
  removeOdd: (Odd: Odd) => void;
}

export const useAppStore = create<AppState>((set) => ({
  getAppData: async () => {
    const resp = await fetch("/api/appData");
    if (resp.ok) {
      const { leagues, countries, teams, matches, bettingMarkets, odds } =
        await resp.json();
      set({ leagues, countries, teams, matches, bettingMarkets, odds });
    } else {
      set({
        leagues: [],
        countries: [],
        teams: [],
        matches: [],
        bettingMarkets: [],
      });
      toast({ title: "Refresh Again Server Error" });
    }
  },

  // Countries
  countries: [],
  // setCountry: (countries: Country[]) => {
  //   set({ countries });
  // },
  addCountry: (country: Country) =>
    set((state) => ({ countries: [...(state.countries || []), country] })),
  updateCountry: (country: Country) =>
    set((state) => ({
      countries: state.countries.map((item) =>
        item.id === country.id ? country : item
      ),
    })),
  removeCountry: (country: Country) =>
    set((state) => ({
      countries: state.countries.filter((item) => item.id !== country.id),
    })),

  // Leagues
  leagues: [],
  // setLeagues: (leagues: League[]) => {
  //   set({ leagues });
  // },
  addLeague: (league: League) =>
    set((state) => ({ leagues: [...(state.leagues || []), league] })),
  updateLeague: (league: League) =>
    set((state) => ({
      leagues: state.leagues.map((item) =>
        item.id === league.id ? league : item
      ),
    })),
  removeLeague: (league: League) =>
    set((state) => ({
      leagues: state.leagues.filter((item) => item.id !== league.id),
    })),
  // Teams
  teams: [],

  addTeam: (Team: Team) =>
    set((state) => ({ teams: [...(state.teams || []), Team] })),
  updateTeam: (Team: Team) =>
    set((state) => ({
      teams: state.teams.map((item) => (item.id === Team.id ? Team : item)),
    })),
  removeTeam: (Team: Team) =>
    set((state) => ({
      countries: state.countries.filter((item) => item.id !== Team.id),
    })),

  // Matches
  matches: [],

  addMatch: (match: Match) =>
    set((state) => ({ matches: [...(state.matches || []), match] })),
  updateMatch: (match: Match) =>
    set((state) => ({
      matches: state.matches.map((item) =>
        item.id === match.id ? match : item
      ),
    })),
  removeMatch: (match: Match) =>
    set((state) => ({
      countries: state.countries.filter((item) => item.id !== match.id),
    })),

  //Betting Markets
  bettingMarkets: [],
  addBettingMarket: (bettingMarket: BettingMarket) =>
    set((state) => ({
      bettingMarkets: [...(state.bettingMarkets || []), bettingMarket],
    })),
  updateBettingMarket: (bettingMarket: BettingMarket) =>
    set((state) => ({
      bettingMarkets: state.bettingMarkets.map((item) =>
        item.id === bettingMarket.id ? bettingMarket : item
      ),
    })),
  removeBettingMarket: (bettingMarket: BettingMarket) =>
    set((state) => ({
      bettingMarkets: state.bettingMarkets.filter(
        (item) => item.id !== bettingMarket.id
      ),
    })),

  // Odds
  odds: [],
  addOdd: (odd: Odd) =>
    set((state) => ({
      odds: [...(state.odds || []), odd],
    })),
  updateOdd: (odd: Odd) =>
    set((state) => ({
      odds: state.odds.map((item) => (item.id === odd.id ? odd : item)),
    })),
  removeOdd: (odd: Odd) =>
    set((state) => ({
      odds: state.odds.filter((item) => item.id !== odd.id),
    })),
}));
