import App from "@/App";
import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./protect-route";
import { Register } from "@/components/register";
import { Login } from "@/components/login";
import Dashboard from "@/components/Dashboard";
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
import BettingMarket from "@/components/matches/bettingmarket/betting-market";
import NewBettingMarket from "@/components/matches/bettingmarket/new-betting-market";
import Odds from "@/components/odds/odds";
import NewOdd from "@/components/odds/new-odd";

export default function Router() {
  const { getAppData } = useAppStore();

  useEffect(() => {
    getAppData();
  }, []);
  return (
    <Routes>
      <Route element={<ProtectRoute />}>
        <Route path="/" Component={App} />
        <Route path="/backoffice/dashboard" Component={Dashboard} />

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
        <Route path="/backoffice/matches/:id" Component={BettingMarket} />
        <Route
          path="/backoffice/matches/:id/newbettingmarket"
          Component={NewBettingMarket}
        />

        {/* Odds */}
        <Route path="/backoffice/odds/:bettingMarketId" Component={Odds} />
        <Route
          path="/backoffice/odds/:bettingMarketId/new"
          Component={NewOdd}
        />
      </Route>

      <Route path="/login" Component={Login} />
      {/* <Route path="/logout" Component={Logout} /> */}
      <Route path="/register" Component={Register} />
    </Routes>
  );
}
