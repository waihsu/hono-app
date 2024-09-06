import { toast } from "@/components/ui/use-toast";
import {
  Bet,
  BettingMarket,
  Country,
  League,
  Match,
  Odd,
  Payment,
  Team,
  Transation,
  User,
} from "@/types/types";
import { create } from "zustand";

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  user_role: string;
  account_status: string;
}

interface AppState {
  admins: User[];
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser) => void;
  getAppData: (userId: string) => void;

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

  //UserBets
  userBets: Bet[];
  userAddBet: (Bet: Bet) => void;
  userUpdateBet: (Bet: Bet) => void;
  userRemoveBet: (Bet: Bet) => void;

  //UserPayments
  userPayments: Payment[];
  // setCountry: (country: Country[]) => void;
  addUserPayment: (payment: Payment) => void;
  updateUserPayment: (payment: Payment) => void;
  removeUserPayment: (payment: Payment) => void;

  //Transations
  userTransations: Transation[];
  // setCountry: (country: Country[]) => void;
  addUserTransation: (Transation: Transation) => void;
  updateUserTransation: (Transation: Transation) => void;
  removeUserTransation: (Transation: Transation) => void;
}

export const useAppStore = create<AppState>((set) => ({
  admins: [],
  currentUser: null,

  setCurrentUser: (user: CurrentUser) => {
    set({ currentUser: user });
  },

  getAppData: async (userId: string) => {
    const resp = await fetch(`/api/appData/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (resp.ok) {
      const {
        leagues,
        countries,
        teams,
        matches,
        bettingMarkets,
        odds,
        payments,
        admins,
        userBets,
        transactions,
        currentUser,
      } = await resp.json();
      set({
        leagues,
        countries,
        teams,
        matches,
        bettingMarkets,
        odds,
        userPayments: payments,
        admins,
        userBets,
        userTransations: transactions,
        currentUser,
      });
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

  addMatch: (match: Match) => {
    set((state) => ({ matches: [...(state.matches || []), match] }));
  },

  updateMatch: (match: Match) =>
    set((state) => ({
      matches: state.matches.map((item) =>
        item.id === match.id ? match : item
      ),
    })),
  removeMatch: (match: Match) =>
    set((state) => ({
      matches: state.matches.filter((item) => item.id !== match.id),
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

  // UserBets
  userBets: [],
  userAddBet: (bet: Bet) =>
    set((state) => ({
      userBets: [...(state.userBets || []), bet],
    })),
  userUpdateBet: (bet: Bet) =>
    set((state) => ({
      userBets: state.userBets.map((item) => (item.id === bet.id ? bet : item)),
    })),
  userRemoveBet: (bet: Bet) =>
    set((state) => ({
      userBets: state.userBets.filter((item) => item.id !== bet.id),
    })),

  // Payments
  userPayments: [],
  addUserPayment: (payment: Payment) =>
    set((state) => ({
      userPayments: [...(state.userPayments || []), payment],
    })),
  updateUserPayment: (payment: Payment) =>
    set((state) => ({
      userPayments: state.userPayments.map((item) =>
        item.id === payment.id ? payment : item
      ),
    })),
  removeUserPayment: (payment: Payment) =>
    set((state) => ({
      userPayments: state.userPayments.filter((item) => item.id !== payment.id),
    })),

  // Transations
  userTransations: [],
  addUserTransation: (Transation: Transation) =>
    set((state) => ({
      userTransations: [...(state.userTransations || []), Transation],
    })),
  updateUserTransation: (Transation: Transation) =>
    set((state) => ({
      userTransations: state.userTransations.map((item) =>
        item.id === Transation.id ? Transation : item
      ),
    })),
  removeUserTransation: (Transation: Transation) =>
    set((state) => ({
      userTransations: state.userTransations.filter(
        (item) => item.id !== Transation.id
      ),
    })),
}));
