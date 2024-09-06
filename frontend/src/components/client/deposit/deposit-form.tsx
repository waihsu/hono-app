import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "@/components/ui/use-toast";
import { useAppStore } from "@/store/use-app-store";
import Layout from "@/components/layout";
import Heading from "@/components/Heading";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

const formSchema = z.object({
  user_id: z.string(),
  payment_id: z.string(),
  amount: z.string(),
  phone_number: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  transfer_id: z.string().min(20, { message: "20 digists" }),
  //   transaction_type: z.string(),
  //   transation_status: z.string()
});

export default function DepositForm() {
  const { paymentId } = useParams();
  const { userPayments, addUserTransation } = useAppStore();
  const { token, user } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const validPayment = userPayments.find((item) => item.id === paymentId);

  const socket = new WebSocket(
    `ws://localhost:3000/admin?type=tran${validPayment?.admin_id}`
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: "5000",
      transfer_id: "",
      payment_id: paymentId,
      phone_number: "",
      user_id: user?.id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const resp = await fetch("/api/transactions/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify(values),
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newTransation } = data;
      addUserTransation(newTransation);
      socket.send(JSON.stringify(newTransation));
      toast({ title: "successfully," });
    }
  }
  return (
    <Layout>
      <div className=" container">
        <Heading button name="Transfer" description="" />

        <Card className="  ">
          <CardHeader>
            <CardTitle className=" grid grid-cols-2 text-sm md:text-xl">
              <p>Payment Method</p>
              <p className="text-primary">{validPayment?.payment_name}</p>
            </CardTitle>
            <CardTitle className="grid grid-cols-2 text-sm md:text-xl">
              <p>Payment Username</p>
              <p className="text-primary">{validPayment?.name}</p>
            </CardTitle>
            <CardTitle className="grid grid-cols-2 text-sm md:text-xl">
              <p>Pyament Number</p>
              <div className="flex items-center gap-2">
                <p className="text-primary">{validPayment?.payment_number}</p>
                <Copy
                  size={20}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      String(validPayment?.payment_number)
                    )
                  }
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className=" grid grid-cols-2 gap-4">
                      <FormLabel className=" flex items-center justify-end">
                        Amount
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" grid grid-cols-2 gap-4">
                      <FormLabel className=" flex items-center justify-end">
                        Your {validPayment?.payment_name.toUpperCase()} Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g maung maung" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className=" grid grid-cols-2 gap-4">
                      <FormLabel className=" flex items-center justify-end">
                        Your {validPayment?.payment_name.toUpperCase()} Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g 09783439834" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transfer_id"
                  render={({ field }) => (
                    <FormItem className=" grid grid-cols-2 gap-4">
                      <FormLabel className=" flex items-center justify-end">
                        Transation Id
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g 20 digists" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={loading} type="submit">
                  {loading ? "loading..." : "Send"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
