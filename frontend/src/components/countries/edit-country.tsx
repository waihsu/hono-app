import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAppStore } from "@/store/use-app-store";
import { toast } from "../ui/use-toast";
import DeleteDialog from "../delete-dialog";
import EditCountryForm from "./edit-country-form";

export default function EditCountry() {
  const { id } = useParams();
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const { countries, removeCountry } = useAppStore();
  const validCountry = countries.find((item) => item.id === id);
  if (!validCountry) return null;
  const onDelete = async () => {
    const resp = await fetch(`/api/countries/${id}`, {
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
      const { deletedCountry } = data;
      console.log(deletedCountry);
      removeCountry(deletedCountry);
      toast({ title: "successful" });
      navigate("/backoffice/countries");
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
            to={`/backoffice/countries`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="edit your Country"
        name="Edit Country"
      />
      <div>
        <div className=" flex justify-end">
          <DeleteDialog
            children={
              <Button>
                <Flag /> Delete
              </Button>
            }
            onDelete={onDelete}
          />
        </div>
        <EditCountryForm country={validCountry} />
      </div>
    </BackofficeLayout>
  );
}
