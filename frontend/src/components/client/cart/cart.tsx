import Layout from "@/components/layout";
import { useBetCartStore } from "@/store/use-bet-cart";
import CartCard from "./cart-card";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "@/components/delete-dialog";
import { useTokenStore } from "@/store/use-bear-store";

export default function Cart() {
  const { betsItems, removeAll } = useBetCartStore();
  const { user } = useTokenStore();
  const navigate = useNavigate();
  const validBets = betsItems.filter((item) => item.userId === user?.id);
  return (
    <Layout>
      <div className=" px-3 sm:container">
        <Heading
          button={
            <Button onClick={() => navigate(-1)} size={"sm"}>
              <ArrowLeft /> Back
            </Button>
          }
          name="Slips"
          description=""
        />

        {validBets.length ? (
          <div className="flex justify-end my-2">
            <DeleteDialog
              children={
                <Button variant={"destructive"} size={"sm"}>
                  <Trash /> Remove All
                </Button>
              }
              onDelete={removeAll}
            />
          </div>
        ) : (
          <></>
        )}
        <div className=" grid grid-cols-1 lg:grid-cols-2 place-items-center gap-4">
          {validBets &&
            validBets.map((item) => <CartCard betItem={item} key={item.id} />)}
        </div>
      </div>
    </Layout>
  );
}
