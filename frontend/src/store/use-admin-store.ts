import {
  Payment,
  Transation,
  Bet,
  BettingMarket,
  Country,
  League,
  Match,
  Odd,
  Team,
  User,
  RunningLeague,
  SocialMediaLink,
  PublishMatch,
} from "@/types/types";
import { create } from "zustand";
import { toast } from "@/components/ui/use-toast";

interface AdminState {
  ws: WebSocket | null;
  connect: (userId: string) => void;
  users: User[];
  bets: Bet[];
  onlineUserids: string[];

  setOnlineUserIds: (value: string[]) => void;

  getAppData: ({ token, userId }: { userId: string; token: string }) => void;

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

  //RunningLeagues
  runningLeagues: RunningLeague[];
  // setLeagues: (leagues: League[]) => void;
  addRunningLeague: (Runningleague: RunningLeague[]) => void;
  updateRunningLeague: (Runningleague: RunningLeague[]) => void;
  removeRunningLeague: (Runningleague: RunningLeague) => void;

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

  // Publish Matches
  publishMatches: PublishMatch[];
  addPublishMatch: (PublishMatch: PublishMatch) => void;
  updatePublishMatch: (PublishMatch: PublishMatch) => void;
  removePublishMatch: (PublishMatch: PublishMatch) => void;

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

  addBet: (bet: Bet) => void;
  updateBet: (bet: Bet) => void;
  removeBet: (bet: Bet) => void;

  //Users
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (user: User) => void;

  //onlineUserIds

  //Payments
  payments: Payment[];
  // setCountry: (country: Country[]) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  removePayment: (payment: Payment) => void;

  //Transations
  transations: Transation[];
  // setCountry: (country: Country[]) => void;
  addTransation: (Transation: Transation) => void;
  updateTransation: (Transation: Transation) => void;
  removeTransation: (Transation: Transation) => void;

  //SocialMediaLinks
  socialMediaLinks: SocialMediaLink[];
  // setCountry: (country: Country[]) => void;
  addSocialMediaLink: (socialMediaLink: SocialMediaLink[]) => void;
  updateSocialMediaLink: (socialMediaLink: SocialMediaLink) => void;
  removeSocialMediaLink: (socialMediaLink: SocialMediaLink) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  ws: null,
  users: [],
  bets: [],
  onlineUserids: [],

  connect: (userId: string) => {
    const ws = new WebSocket(`/ws?type=admin&userId=${userId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse the incoming message

        if (data.type === "online-users") {
          console.log("Online Users: ", data.onlineClients, data.onlineAdmins);
          // set({ onlineClients: data.onlineClients, onlineAdmins: data.onlineAdmins });
        } else if (data.type === "user-online") {
          console.log(`${data.userId} (${data.userType}) is now online.`);
        } else if (data.type === "user-offline") {
          console.log(`${data.userId} (${data.userType}) is now offline.`);
        } else if (data.type === "publishmatch") {
          // console.log(data.message);
          set((state) => ({
            publishMatches: state.publishMatches.find(
              (item) => item.id === data.message.id
            )
              ? state.publishMatches.filter(
                  (item) => item.id !== data.message.id
                )
              : [...state.publishMatches, data.message],
          }));
        } else if (data.type === "newbettingmarket") {
          set((state) => ({
            bettingMarkets: [...(state.bettingMarkets || []), data.message],
          }));
        } else if (data.type === "deposit") {
          set((state) => ({
            transations: [...(state.transations || []), data.message],
          }));
        } else if (data.type === "withdraw") {
          set((state) => ({
            transations: [...(state.transations || []), data.message],
          }));
        } else if (data.type === "newbet") {
          set((state) => ({ bets: [...state.bets, data.message] }));
        } else {
          console.log("type not found");
        }
      } catch (err) {
        console.log(err);
        console.error("Invalid message format received:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    set({ ws });
  },

  setOnlineUserIds: (value: string[]) => {
    set({ onlineUserids: value });
  },

  getAppData: async ({ token, userId }: { userId: string; token: string }) => {
    const resp = await fetch(`/api/admin/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Bearer: token },
    });
    if (resp.ok) {
      const {
        leagues,
        runningLeagues,
        countries,
        teams,
        matches,
        bettingMarkets,
        odds,
        payments,
        bets,
        users,
        transations,
        socialMediaLinks,
        publishMatches,
      } = await resp.json();
      set({
        leagues,
        runningLeagues,
        countries,
        teams,
        matches,
        bettingMarkets,
        odds,
        payments,
        bets,
        users,
        transations,
        socialMediaLinks,
        publishMatches,
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

  // Running Leagues
  runningLeagues: [],
  // setLeagues: (leagues: League[]) => {
  //   set({ leagues });
  // },
  addRunningLeague: (runningleague: RunningLeague[]) =>
    set((state) => ({
      runningLeagues: [...state.runningLeagues, ...runningleague],
    })),
  updateRunningLeague: (runningleague: RunningLeague[]) =>
    set((state) => ({
      runningLeagues: state.runningLeagues.map((item) => {
        const updatedLeague = runningleague.find(
          (league) => league.id === item.id
        );
        return updatedLeague ? { ...item, ...updatedLeague } : item;
      }),
    })),
  removeRunningLeague: (runningleague: RunningLeague) =>
    set((state) => ({
      runningLeagues: state.runningLeagues.filter(
        (item) => item.id !== runningleague.id
      ),
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
      teams: state.teams.filter((item) => item.id !== Team.id),
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

  //Publish Matches

  publishMatches: [],

  addPublishMatch: (publishMatch: PublishMatch) => {
    set((state) => ({
      publishMatches: state.publishMatches.find(
        (item) => item.id === publishMatch.id
      )
        ? state.publishMatches.filter((item) => item.id !== publishMatch.id)
        : [...state.publishMatches, publishMatch],
    }));
  },

  updatePublishMatch: (publishMatch: PublishMatch) =>
    set((state) => ({
      publishMatches: state.publishMatches.map((item) =>
        item.id === publishMatch.id ? publishMatch : item
      ),
    })),
  removePublishMatch: (publishMatch: PublishMatch) =>
    set((state) => ({
      publishMatches: state.publishMatches.filter(
        (item) => item.id !== publishMatch.id
      ),
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

  addBet: (bet: Bet) => set((state) => ({ bets: [...state.bets, bet] })),
  updateBet: (bet: Bet) =>
    set((state) => ({
      bets: state.bets.map((item) => (item.id === bet.id ? bet : item)),
    })),
  removeBet: (bet: Bet) =>
    set((state) => ({ bets: state.bets.filter((item) => item.id !== bet.id) })),

  //Users
  addUser: (user: User) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (user: User) =>
    set((state) => ({
      users: state.users.map((item) => (item.id === user.id ? user : item)),
    })),
  removeUser: (user: User) =>
    set((state) => ({
      users: state.users.filter((item) => item.id !== user.id),
    })),

  // Payments
  payments: [],
  addPayment: (payment: Payment) =>
    set((state) => ({
      payments: [...(state.payments || []), payment],
    })),
  updatePayment: (payment: Payment) =>
    set((state) => ({
      payments: state.payments.map((item) =>
        item.id === payment.id ? payment : item
      ),
    })),
  removePayment: (payment: Payment) =>
    set((state) => ({
      payments: state.payments.filter((item) => item.id !== payment.id),
    })),

  // Transations
  transations: [],
  addTransation: (Transation: Transation) =>
    set((state) => ({
      transations: [...(state.transations || []), Transation],
    })),
  updateTransation: (Transation: Transation) =>
    set((state) => ({
      transations: state.transations.map((item) =>
        item.id === Transation.id ? Transation : item
      ),
    })),
  removeTransation: (Transation: Transation) =>
    set((state) => ({
      transations: state.transations.filter(
        (item) => item.id !== Transation.id
      ),
    })),

  // Social Media Links
  socialMediaLinks: [],
  addSocialMediaLink: (socialMediaLink: SocialMediaLink[]) =>
    set((state) => ({
      socialMediaLinks: [...state.socialMediaLinks, ...socialMediaLink],
    })),
  updateSocialMediaLink: (socialMediaLink: SocialMediaLink) =>
    set((state) => ({
      socialMediaLinks: state.socialMediaLinks.map((item) =>
        item.id === socialMediaLink.id ? socialMediaLink : item
      ),
    })),
  removeSocialMediaLink: (socialMediaLink: SocialMediaLink) =>
    set((state) => ({
      socialMediaLinks: state.socialMediaLinks.filter(
        (item) => item.id !== socialMediaLink.id
      ),
    })),
}));
