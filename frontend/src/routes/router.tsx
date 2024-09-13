import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./protect-route";
import { Register } from "@/components/register";
import { Login } from "@/components/login";
import Leagues from "@/components/leagues/Leagues";
import NewLeague from "@/components/leagues/new-league";
import { useEffect } from "react";
import EditLeague from "@/components/leagues/edit-league";
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
import BackofficeDashboard from "@/components/dashboard/dashboard";
import EditBettingMarket from "@/components/bettingmarket/edit-bettingMarket";
import Transations from "@/components/transations/transtations";
import Payments from "@/components/payments/payments";
import NewPayment from "@/components/payments/new-payment";
import EditPayment from "@/components/payments/edit-payment";
import { useAdminStore } from "@/store/use-admin-store";
import App from "@/App";

import Settings from "@/components/settings/settings";
import AdminSettings from "@/components/settings/admin";
import Customers from "@/components/customers/customers";
import SingleCustomerView from "@/components/customers/single-customer-view";
import RecentMatches from "@/components/matches/recent-matches";
import NextMatches from "@/components/matches/next-matches";

export default function Router() {
  const { user, token } = useTokenStore();
  const { getAppData, connect } = useAdminStore();

  useEffect(() => {
    if (!user?.id || !token) return;
    getAppData({ userId: String(user?.id), token });

    connect(user.id);
  }, []);

  return (
    <Routes>
      <Route element={<ProtectRoute />}>
        <Route path="/" Component={App} />

        {/* BackOffice Dashboard */}
        <Route path="/dashboard" Component={BackofficeDashboard} />
        <Route path="/customers" Component={Customers} />
        <Route path="/customers/:userId" Component={SingleCustomerView} />

        <Route path="/payments" Component={Payments} />
        <Route path="/payments/new" Component={NewPayment} />
        <Route path="/payments/:paymentId" Component={EditPayment} />

        <Route path="/transations" Component={Transations} />

        {/* League */}
        <Route path="/leagues" Component={Leagues} />
        <Route path="/leagues/new" Component={NewLeague} />
        <Route path="/leagues/:id" Component={EditLeague} />

        {/* Running League */}
        {/* <Route path="/runningleagues" Component={RunningLeague} />
        <Route path="/runningleagues/new" Component={NewRunningLeague} />
        <Route path="/runningleagues/:id" Component={EidtRunningLeague} /> */}

        {/* Country */}
        <Route path="/countries" Component={Countries} />
        <Route path="/countries/new" Component={NewCountry} />
        <Route path="/countries/:id" Component={EditCountry} />

        {/* Teams */}
        <Route path="/teams" Component={Teams} />
        <Route path="/teams/new" Component={NewTeam} />
        <Route path="/teams/:teamId" Component={EditTeam} />

        {/* Matches */}
        <Route path="/matches" Component={Matches} />
        <Route path="/matches/recent" Component={RecentMatches} />
        <Route path="/matches/next" Component={NextMatches} />
        <Route path="/matches/new" Component={NewMatch} />
        <Route path="/matches/:id" Component={EditMatch} />

        {/* Betting Market */}
        <Route path="/bettingMarkets" Component={BettingMarketsByMatch} />
        <Route
          path="/bettingMarkets/:publishMatchId"
          Component={BettingMarket}
        />

        <Route
          path="/bettingMarket/:publishMatchId/newbettingmarket"
          Component={NewBettingMarket}
        />
        <Route
          path="/bettingMarket/edit/:bettingMarketId"
          Component={EditBettingMarket}
        />

        {/* Odds */}
        <Route path="/odds/:matchId/:bettingMarketId" Component={Odds} />
        <Route path="/odds/:matchId/:bettingMarketId/new" Component={NewOdd} />
        <Route path="/odds/:oddId" Component={EditOdd} />

        {/* Bets */}

        <Route path="/bets" Component={Bets} />

        <Route path="/settings" Component={Settings} />
        <Route path="/settings/admin" Component={AdminSettings} />
      </Route>

      <Route path="/login" Component={Login} />
      {/* <Route path="/logout" Component={Logout} /> */}
      <Route path="/register" Component={Register} />
    </Routes>
  );
}
