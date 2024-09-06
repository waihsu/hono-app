import Heading from "@/components/Heading";
import Layout from "@/components/layout";

import { useAppStore } from "@/store/use-app-store";
import PaymentList from "./payment-list";

export default function Deposit() {
  const { userPayments } = useAppStore();
  return (
    <Layout>
      <div className=" container">
        <Heading
          button
          name="Deposit"
          description="two payment method you can choose"
        />

        <div className="  ">
          <PaymentList payments={userPayments} />
        </div>
      </div>
    </Layout>
  );
}
