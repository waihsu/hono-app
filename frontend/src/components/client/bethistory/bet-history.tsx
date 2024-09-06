import Layout from "@/components/layout";
import { useAppStore } from "@/store/use-app-store";

import BetHistoryList from "./bet-history-list";

export default function BetHistory() {
  const { userBets } = useAppStore();
  return (
    <Layout>
      <div className="container ">
        <BetHistoryList bets={userBets} />
      </div>
    </Layout>
  );
}
