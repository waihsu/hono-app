import React from "react";
import BackofficeLayout from "@/components/backoffice-layout";
import Heading from "@/components/Heading";

export default function Settings() {
  return (
    <BackofficeLayout>
      <Heading button description="customize your data" name="Setting" />
      <div className=" ">Settings</div>
    </BackofficeLayout>
  );
}
