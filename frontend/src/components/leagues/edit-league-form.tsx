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

import { League } from "@/types/types";
import { toast } from "../ui/use-toast";
import { useAdminStore } from "@/store/use-admin-store";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export default function EditLeagueForm({ league }: { league: League }) {
  const { updateLeague } = useAdminStore();
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: league.id,
      name: league.name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const resp = await fetch(`/api/leagues/${league.id}`, {
      method: "PUT",
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
      const { updatedLeague } = data;
      console.log(updatedLeague);
      updateLeague(updatedLeague);
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g Champions League" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? "loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}
