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
import BackofficeDashboard from "@/components/dashboard/dashboard";
import MarketByMatch from "@/components/client/match/markets-by-match";
import EditBettingMarket from "@/components/bettingmarket/edit-bettingMarket";
import Cart from "@/components/client/cart/cart";
import Transations from "@/components/transations/transtations";
import Deposit from "@/components/client/deposit/deposit";
import Withdraw from "@/components/client/withdraw/withdraw";
import Payments from "@/components/payments/payments";
import NewPayment from "@/components/payments/new-payment";
import EditPayment from "@/components/payments/edit-payment";
import BetHistory from "@/components/client/bethistory/bet-history";
import TransationHistroy from "@/components/client/transationhistory/transation-history";
import DepositForm from "@/components/client/deposit/deposit-form";
import AdminByMatches from "@/components/client/adminbymatches/adminbymatches";

export default function Router() {
  const {
    getAppData,
    addMatch,
    updateMatch,
    removeMatch,
    addBettingMarket,
    removeBettingMarket,
    addOdd,
    updateOdd,
    removeOdd,
    userUpdateBet,
    addUserPayment,
    updateUserPayment,
    setCurrentUser,
  } = useAppStore();

  const { user } = useTokenStore();

  const socket = new WebSocket(`ws://localhost:3000/app?userId=${user?.id}`);

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
        // console.log(payload);
        addBettingMarket(JSON.parse(payload));
      } else if (type === "deleteBettingMarket") {
        removeBettingMarket(JSON.parse(payload));
      } else if (type === "newodd") {
        addOdd(JSON.parse(payload));
      } else if (type === "editodd") {
        updateOdd(JSON.parse(payload));
      } else if (type === "deleteodd") {
        removeOdd(JSON.parse(payload));
      } else if (type === user?.id) {
        userUpdateBet(JSON.parse(payload));
      } else if (type === "newpayment") {
        addUserPayment(JSON.parse(payload));
      } else if (type === "editpayment") {
        updateUserPayment(JSON.parse(payload));
      } else if (type === `balance${user?.id}`) {
        console.log(payload);
        setCurrentUser(JSON.parse(payload));
      }
    };
    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    if (!user?.id) return;
    getAppData(user?.id as string);
  }, []);
  return (
    <Routes>
      <Route element={<ProtectRoute />}>
        <Route path="/" Component={App} />
        <Route path="/allmatches/:adminId" Component={AdminByMatches} />
        <Route path="/:adminId/matches/:matchId" Component={MarketByMatch} />

        {/* Client Bets */}
        <Route path="/bethistory" Component={BetHistory} />
        <Route path="/transations" Component={TransationHistroy} />

        {/* Transation */}
        <Route path="/deposit" Component={Deposit} />
        <Route path="/deposit/:paymentId" Component={DepositForm} />
        <Route path="/withdraw" Component={Withdraw} />

        {/* Carts */}
        <Route path="/carts/:userId" Component={Cart} />

        {/* BackOffice Dashboard */}
        <Route path="/backoffice/dashboard" Component={BackofficeDashboard} />
        <Route path="/backoffice/payments" Component={Payments} />
        <Route path="/backoffice/payments/new" Component={NewPayment} />
        <Route path="/backoffice/payments/:paymentId" Component={EditPayment} />

        <Route path="/backoffice/transations" Component={Transations} />

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
