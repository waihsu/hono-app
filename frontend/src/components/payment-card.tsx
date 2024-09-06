import { Payment } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PaymentCardProps {
  payment: Payment;
  href?: string;
}

export default function PaymentCard({ payment, href }: PaymentCardProps) {
  if (href) {
    return (
      <Link to={href}>
        <Card className=" max-w-xl border border-border">
          <CardHeader>
            <CardTitle>{payment.payment_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{payment.name}</p>
            <p>{payment.payment_number}</p>
          </CardContent>
        </Card>
      </Link>
    );
  }
  return (
    <Card className=" max-w-xl border border-border">
      <CardHeader>
        <CardTitle>{payment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{payment.name}</p>
        <p>{payment.payment_number}</p>
      </CardContent>
    </Card>
  );
}
