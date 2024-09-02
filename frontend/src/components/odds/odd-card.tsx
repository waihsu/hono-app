import { Odd } from "@/types/types";
import React from "react";

export default function OddCard({ odd }: { odd: Odd }) {
  return (
    <div className="bg-card shadow-sm p-2 rounded-sm border border-border">
      <div className=" flex justify-between items-center  p-2">
        <div>{odd.outcome}</div>
        <div>{odd.odd_value}</div>
      </div>
    </div>
  );
}
