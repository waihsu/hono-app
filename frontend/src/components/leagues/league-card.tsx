import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ShieldHalf } from "lucide-react";

export default function LeagueCard({ name }: { name: string }) {
  return (
    <Card>
      <CardHeader>
        <ShieldHalf className=" mx-auto" size={30} />
        <CardTitle className=" text-center">{name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
