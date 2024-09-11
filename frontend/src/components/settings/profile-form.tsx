import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Trash } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import { useTokenStore } from "@/store/use-bear-store";
import { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const profileFormSchema = z.object({
  //   username: z
  //     .string()
  //     .min(2, {
  //       message: "Username must be at least 2 characters.",
  //     })
  //     .max(30, {
  //       message: "Username must not be longer than 30 characters.",
  //     }),
  //   email: z
  //     .string({
  //       required_error: "Please select an email to display.",
  //     })
  //     .email(),
  user_id: z.string(),
  urls: z
    .array(
      z.object({
        name: z.string(),
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.

export function ProfileForm() {
  const socket = new WebSocket(`/ws/actions?type=newsocial`);
  const { socialMediaLinks, addSocialMediaLink } = useAdminStore();
  const { user, token } = useTokenStore();
  const [loading, setLoading] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      user_id: user?.id,
      //   username: user?.username,
      //   email: user?.email,
      urls: !socialMediaLinks.length
        ? [{ name: "", value: "" }]
        : socialMediaLinks.map((item) => ({
            name: item.name,
            value: item.link,
          })),
    },
    // mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  async function onSubmit(values: ProfileFormValues) {
    // if (data.email !== user?.email)
    //   return toast({ title: "Email Cannot be change", variant: "destructive" });
    // if (data.username !== user?.username)
    //   return toast({
    //     title: "Username Cannot be change",
    //     variant: "destructive",
    //   });

    // existLinkfiltered
    // console.log(
    //   values.urls?.filter(
    //     (item) =>
    //       !socialMediaLinks
    //         .map((iname) => iname.name.toLowerCase())
    //         .includes(item.name.toLowerCase()) ||
    //       !socialMediaLinks
    //         .map((iname) => iname.link.toLowerCase())
    //         .includes(item.value.toLowerCase())
    //   )
    // );
    values.urls = values.urls?.filter(
      (item) =>
        !socialMediaLinks
          .map((iname) => iname.name.toLowerCase())
          .includes(item.name.toLowerCase()) ||
        !socialMediaLinks
          .map((iname) => iname.link.toLowerCase())
          .includes(item.value.toLowerCase())
    );
    setLoading(true);
    const resp = await fetch(`/api/profiles/socialmedia`, {
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
      toast({ title: messg, variant: "destructive" });
    } else {
      const { newSocialMediaLink } = data;
      socket.send(JSON.stringify(newSocialMediaLink));
      addSocialMediaLink(newSocialMediaLink);
    }
  }

  return (
    <div className="space-y-4 ">
      <div className="">
        <Label>Username</Label>
        <Input defaultValue={user?.username} />
      </div>
      <div className="">
        <Label>Email</Label>
        <Input defaultValue={user?.email} />
      </div>

      <Separator className="mb-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <div className=" grid grid-cols-2 mb-3 gap-3  ">
              <div>Social Media Name</div>
              <div>Social Media Link</div>
            </div>
            {fields.map((field, index) => (
              <div key={index}>
                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    key={`urls.${index}.name`}
                    name={`urls.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="e.g 'Facebook'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    key={`urls.${index}.value`}
                    name={`urls.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="e.g 'https://www.facebook.com'"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-auto"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "", value: "" })}
            >
              Add URL
            </Button>
          </div>
          <Button disabled={loading} type="submit">
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
