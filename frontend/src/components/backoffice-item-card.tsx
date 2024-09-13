import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BackofficeItemCardProps {
  name: string;
  icon: React.ReactNode;
  value: number;
}

export default function BackofficeItemCard({
  name,
  icon: Icon,
  value,
}: BackofficeItemCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm md:text-xl font-medium">{name}</CardTitle>
        {Icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold"> {value}</div>
      </CardContent>
    </Card>
  );
}
