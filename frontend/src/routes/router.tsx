import App from "@/App";
import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./protect-route";
import { Register } from "@/components/register";
import { Login } from "@/components/login";
import Leagues from "@/components/leagues/Leagues";
import NewLeague from "@/components/new-league/new-league";
import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";
import EditLeague from "@/components/edit-league";
import Countries from "@/components/countries/countries";
// import Settings from "@/components/settings/settings";
import Matches from "@/components/matches/matches";
import NewCountry from "@/components/countries/new-country";
import EditCountry from "@/components/countries/edit-country";
import Teams from "@/components/Teams/teams";
import NewTeam from "@/components/Teams/new-team";
import EditTeam from "@/components/Teams/edit-team";
import NewMatch from "@/components/matches/new-match";
import BettingMarket from "@/components/bettingmarket/betting-market";
import NewBettingMarket from "@/components/bettingmarket/new-betting-market";
import Odds from "@/components/odds/odds";
import NewOdd from "@/components/odds/new-odd";
import EditOdd from "@/components/odds/edit-odd";
import EditMatch from "@/components/matches/edit-match";
import BettingMarketsByMatch from "@/components/bettingmarket/BettingMarketsByMatch";
import Bets from "@/components/bets/bets";
import { useTokenStore } from "@/store/use-bear-store";
import { useAdminStore } from "@/store/use-admin-store";
import BackofficeDashboard from "@/components/dashboard/dashboard";
import MarketByMatch from "@/components/client/match/markets-by-match";
import EditBettingMarket from "@/components/bettingmarket/edit-bettingMarket";

export default function Router() {
  const {
    getAppData,
    addMatch,
    updateMatch,
    removeMatch,
    addBettingMarket,
    removeBettingMarket,
  } = useAppStore();
  const { getAdminAppData } = useAdminStore();
  const { token, user } = useTokenStore();

  const socket = new WebSocket(`/app?userId=${user?.id}`);

  useEffect(() => {
    socket.onopen = () => {
      socket.send("connected");
    };
    socket.onmessage = (ev) => {
      const { type, payload } = JSON.parse(ev.data);

      if (type === "newmatch") {
        console.log(type);
        // console.log(payload);
        addMatch(JSON.parse(payload));
      } else if (type === "editmatch") {
        console.log(type);
        // console.log((payload));
        updateMatch(JSON.parse(payload));
      } else if (type === "removematch") {
        // console.log(payload);
        removeMatch(JSON.parse(payload));
      } else if (type === "newbettingmarket") {
        console.log(payload);
        addBettingMarket(JSON.parse(payload));
      } else if (type === "deleteBettingMarket") {
        removeBettingMarket(JSON.parse(payload));
      }
    };
    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    getAppData();
    if (token) {
      getAdminAppData(token);
    }
  }, []);
  return (
    <Routes>
      <Route element={<ProtectRoute />}>
        <Route path="/" Component={App} />
        <Route path="/matches/:matchId" Component={MarketByMatch} />

        {/* BackOffice Dashboard */}
        <Route path="/backoffice/dashboard" Component={BackofficeDashboard} />

        {/* League */}
        <Route path="/backoffice/leagues" Component={Leagues} />
        <Route path="/backoffice/leagues/new" Component={NewLeague} />
        <Route path="/backoffice/leagues/:id" Component={EditLeague} />

        {/* Country */}
        <Route path="/backoffice/countries" Component={Countries} />
        <Route path="/backoffice/countries/new" Component={NewCountry} />
        <Route path="/backoffice/countries/:id" Component={EditCountry} />

        {/* Teams */}
        <Route path="/backoffice/teams" Component={Teams} />
        <Route path="/backoffice/teams/new" Component={NewTeam} />
        <Route path="/backoffice/teams/:id" Component={EditTeam} />

        {/* Matches */}
        <Route path="/backoffice/matches" Component={Matches} />
        <Route path="/backoffice/matches/new" Component={NewMatch} />
        <Route path="/backoffice/matches/:id" Component={EditMatch} />

        {/* Betting Market */}
        <Route
          path="/backoffice/bettingMarkets"
          Component={BettingMarketsByMatch}
        />
        <Route
          path="/backoffice/bettingMarkets/:matchId"
          Component={BettingMarket}
        />

        <Route
          path="/backoffice/bettingMarket/:matchId/newbettingmarket"
          Component={NewBettingMarket}
        />
        <Route
          path="/backoffice/bettingMarket/edit/:bettingMarketId"
          Component={EditBettingMarket}
        />

        {/* Odds */}
        <Route
          path="/backoffice/odds/:matchId/:bettingMarketId"
          Component={Odds}
        />
        <Route
          path="/backoffice/odds/:matchId/:bettingMarketId/new"
          Component={NewOdd}
        />
        <Route path="/backoffice/odds/:oddId" Component={EditOdd} />

        {/* Bets */}

        <Route path="/backoffice/bets" Component={Bets} />
      </Route>

      <Route path="/login" Component={Login} />
      {/* <Route path="/logout" Component={Logout} /> */}
      <Route path="/register" Component={Register} />
    </Routes>
  );
}
