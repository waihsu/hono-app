import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "../Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, ShieldHalf } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditRunningLeageForm from "./edit-running-league-form";

export default function EidtRunningLeague() {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { runningLeagues } = useAdminStore();
  const validRunningLeague = runningLeagues.find((item) => item.id === id);
  // console.log(validRunningLeague);

  const teamIdsByLeague = runningLeagues
    .filter((item) => item.league_id === validRunningLeague?.league_id)
    .map((item) => item.team_id);

  if (!validRunningLeague) return null;

  const onDelete = async () => {
    const resp = await fetch(`/api/runngingleagues/${id}`, {
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
      // const { deletedLeague } = data;
      toast({ title: "successful" });
      navigate("/runningleagues");
    }
  };
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/runningleagues`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="edit your running leagues"
        name="Edit Running Leagues"
      />
      <div>
        <div className=" flex justify-end">
          <DeleteDialog
            children={
              <Button>
                <ShieldHalf /> Delete
              </Button>
            }
            onDelete={onDelete}
          />
        </div>
        <EditRunningLeageForm
          currentId={String(id)}
          currentTeamIds={teamIdsByLeague}
          connectedLeagueId={validRunningLeague.league_id}
        />
      </div>
    </BackofficeLayout>
  );
}
