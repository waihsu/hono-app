import PaymentCard from "@/components/payment-card";
import { Payment } from "@/types/types";
import React from "react";

export default function PaymentList({ payments }: { payments: Payment[] }) {
  return (
    <div>
      {payments &&
        payments.map((item) => (
          <PaymentCard
            key={item.id}
            payment={item}
            href={`/deposit/${item.id}`}
          />
        ))}
    </div>
  );
}
