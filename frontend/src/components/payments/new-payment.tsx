import React from "react";
import BackofficeLayout from "../backoffice-layout";
import Heading from "../Heading";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import NewPaymentForm from "./new-payment-form";

export default function NewPayment() {
  return (
    <BackofficeLayout>
      <Heading
        button={
          <Link
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-x-2"
            )}
            to={`/payments`}
          >
            <ArrowLeft /> Back
          </Link>
        }
        description="create a payment"
        name="New Payment"
      />
      <div>
        <NewPaymentForm />
      </div>
    </BackofficeLayout>
  );
}
