import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "../ui/use-toast";
import { User } from "@/types/types";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { useAdminStore } from "@/store/use-admin-store";

const FormSchema = z.object({
  superAdminId: z.string(),
  email: z.string({
    required_error: "Please select a language.",
  }),
});

interface CreateAdminFormProps {
  users: User[];
  superAdminId: string;
}

export function CreateAdminForm({ users, superAdminId }: CreateAdminFormProps) {
  const { token } = useTokenStore();
  const { updateUser } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      superAdminId: superAdminId,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    const resp = await fetch(`/api/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Bearer: token,
      },
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!resp.ok) {
      const { messg } = await resp.json();
      toast({ title: messg, variant: "destructive" });
    } else {
      const { createdAdmin } = await resp.json();
      updateUser(createdAdmin);
      toast({ title: "Successful" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Email</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        " justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find((user) => user.email === field.value)
                            ?.email
                        : "Select an Email to be admin"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search users..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.email}
                            key={user.email}
                            onSelect={() => {
                              form.setValue("email", user.email);
                            }}
                          >
                            {user.email}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                user.email === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Select an email for your admin</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
