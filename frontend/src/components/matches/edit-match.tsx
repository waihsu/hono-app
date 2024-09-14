import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditMatchForm from "./edit-match-form";

export default function EditMatch() {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { matches, ws } = useAdminStore();
  const match = matches.find((item) => item.id === id);
  if (!match || !ws) return null;
  const onDelete = async () => {
    const resp = await fetch(`/api/matches/${id}`, {
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
      const { deletedMatch } = data;
      console.log(deletedMatch);
      ws.send(
        JSON.stringify({
          type: "deletematch",
          message: deletedMatch,
          sendTo: "client",
        })
      );
      toast({ title: "successful" });
      navigate("/matches");
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
            to={`/matches`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="edit your Match"
        name="Edit Match"
      />
      <div>
        <div className=" flex justify-end mb-3">
          <DeleteDialog
            children={
              <Button variant={"destructive"}>
                <Flag /> Delete
              </Button>
            }
            onDelete={onDelete}
          />
        </div>
        <EditMatchForm match={match} ws={ws} />
      </div>
    </BackofficeLayout>
  );
}
