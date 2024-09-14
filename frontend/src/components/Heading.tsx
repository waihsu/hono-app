import React from "react";
import { Separator } from "./ui/separator";

export default function Heading({
  name,
  description,
  button,
}: {
  name: string;
  description: string;
  button: React.ReactNode;
}) {
  return (
    <div className=" my-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl uppercase sm:text-2xl font-semibold text-primary">
            {name}
          </h1>
          <h2 className="text-sm text-muted-foreground">{description}</h2>
        </div>
        {button}
      </div>
      <Separator className="my-4" />
    </div>
  );
}
