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
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  admin_id: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  payment_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  payment_number: z.string().min(11, {
    message: "Phone number be at least 11 characters.",
  }),
});

export default function NewPaymentForm() {
  const socket = new WebSocket(
    `ws://localhost:3000/ws/actions?type=newpayment`
  );
  const { token, user } = useTokenStore();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admin_id: user?.id,
      name: "",
      payment_name: "",
      payment_number: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const resp = await fetch("/api/payments", {
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
      const { newPayment } = data;
      // console.log(newPayment);
      socket.send(JSON.stringify(newPayment));
      toast({ title: "successful" });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g Kpay user name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Kpay or Wavepay" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g phone number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
