import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Flag } from "lucide-react";

export default function CountryCard({ name }: { name: string }) {
  return (
    <Card>
      <CardHeader>
        <Flag className=" mx-auto" size={30} />
        <CardTitle className=" text-center">{name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
