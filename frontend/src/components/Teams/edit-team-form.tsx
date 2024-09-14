import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTokenStore } from "@/store/use-bear-store";
import { toast } from "../ui/use-toast";
import { useAdminStore } from "@/store/use-admin-store";
import ReactFileDropZone from "../react-drop-zone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@/types/types";
import { useParams } from "react-router-dom";

// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
// const ACCEPTED_FILE_TYPES = ["image/png"];
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shortName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  tla: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image_url: z.string(),
  address: z.string(),
  website: z.string(),
  founded: z.string(),
  venue: z.string(),
  clubColors: z.string(),
});

export default function EditTeamForm({ team }: { team: Team }) {
  const { updateTeam } = useAdminStore();
  const { teamId } = useParams();
  const { token } = useTokenStore();
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      address: team.address,
      website: team.website,
      venue: team.venue,
      clubColors: team.clubColors,
      founded: String(team.founded),
      image_url: team.image_url,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    if (selectedFile.length) {
      formData.append("file", selectedFile[0]);
    }

    formData.append("image_url", values.image_url);
    formData.append("name", values.name);
    formData.append("shortName", values.shortName);
    formData.append("tla", values.tla);
    formData.append("address", values.address);
    formData.append("website", values.website);
    formData.append("venue", values.venue);
    formData.append("clubColors", values.clubColors);
    formData.append("founded", values.founded);
    setLoading(true);
    const resp = await fetch(`/api/teams/${teamId}`, {
      method: "PUT",
      headers: {
        Bearer: token,
      },
      body: formData,
    });
    setLoading(false);
    const data = await resp.json();
    if (!resp.ok) {
      const { messg } = data;
      console.log(messg);
      toast({ title: messg, variant: "destructive" });
    } else {
      const { updatedTeam } = data;

      updateTeam(updatedTeam);
      toast({ title: "successful" });
    }
  }

  function onFileSelected(acceptFile: File | undefined) {
    if (!acceptFile) return;
    setSelectedFile([acceptFile]);
  }
  return (
    <div>
      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ShortName</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tla"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TLA</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Field</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clubColors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Color</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="founded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ReactFileDropZone
                  image_url={team.image_url}
                  onFileSelected={onFileSelected}
                  selectedFile={selectedFile[0]}
                />
              </div>
            </div>

            <Button disabled={loading} type="submit">
              {loading ? "loading..." : "Update"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
