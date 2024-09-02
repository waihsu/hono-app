import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft, Gamepad } from "lucide-react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAppStore } from "@/store/use-app-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditOddForm from "./edit-odd-form";

export default function EditOdd() {
  const { oddId } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { odds, teams, removeOdd } = useAppStore();
  const validOdd = odds.find((item) => item.id === oddId);
  if (!validOdd) return null;

  const searchParams = new URLSearchParams(location.search);
  // console.log(location.search);
  const home_team_id = searchParams.get("home_id");
  const away_team_id = searchParams.get("away_id");
  console.log(home_team_id, away_team_id);
  const validTeams = teams.filter(
    (item) => item.id === home_team_id || item.id === away_team_id
  );
  const data = validTeams.map((item) => ({ id: item.id, name: item.name }));

  const onDelete = async () => {
    const resp = await fetch(`/api/odds/${oddId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
    });
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { deletedOdd } = data;
      console.log(deletedOdd);
      removeOdd(deletedOdd);
      toast({ title: "successful" });
      navigate("/backoffice/countries");
    }
  };
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Button variant={"outline"} onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </Button>
        }
        description="edit your Odd"
        name="Edit Odd"
      />
      <div>
        <div className=" flex justify-end">
          <DeleteDialog
            children={
              <Button variant={"destructive"}>
                <Gamepad /> Delete
              </Button>
            }
            onDelete={onDelete}
          />
        </div>
        <EditOddForm odd={validOdd} data={data} />
      </div>
    </BackofficeLayout>
  );
}
