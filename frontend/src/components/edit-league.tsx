import React from "react";
import BackofficeLayout from "./backoffice-layout";
import Heading from "./Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeft, ShieldHalf } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import EditLeagueForm from "./edit-league-form";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "./ui/use-toast";
import DeleteDialog from "./delete-dialog";

export default function EidtLeague() {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { leagues, removeLeague } = useAppStore();
  const validLeague = leagues.find((item) => item.id === id);
  if (!validLeague) return null;
  const onDelete = async () => {
    const resp = await fetch(`/api/leagues/${id}`, {
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
      const { deletedLeague } = data;
      console.log(deletedLeague);
      removeLeague(deletedLeague);
      toast({ title: "successful" });
      navigate("/backoffice/leagues");
    }
  };
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex items-center gap-x-2"
            )}
            to={`/backoffice/leagues`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="edit your leagues"
        name="Edit Leagues"
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
        <EditLeagueForm league={validLeague} />
      </div>
    </BackofficeLayout>
  );
}
