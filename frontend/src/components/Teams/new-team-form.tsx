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

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png"];
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shortName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  tla: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  imageFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(String(file?.type));
    }, "File must be a PNG"),
  address: z.string(),
  website: z.string(),
  founded: z.string(),
  venue: z.string(),
  clubColors: z.string(),
});

export default function NewTeamForm() {
  const { addTeam } = useAdminStore();
  const { token } = useTokenStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortName: "",
      tla: "",
      address: "",
      website: "",
      venue: "",
      clubColors: "",
      founded: "",
      imageFile: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.imageFile) return toast({ title: "Image Required" });
    const formData = new FormData();
    formData.append("file", values.imageFile);
    formData.append("name", values.name);
    formData.append("shortName", values.shortName);
    formData.append("tla", values.tla);
    formData.append("address", values.address);
    formData.append("website", values.website);
    formData.append("venue", values.venue);
    formData.append("clubColors", values.clubColors);
    formData.append("founded", values.founded);
    setLoading(true);
    const resp = await fetch("/api/teams", {
      method: "POST",
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
      const { newTeam } = data;
      console.log(newTeam);
      addTeam(newTeam);
      toast({ title: "successful" });
    }
  }

  // const upload = async () => {
  //   if (!selectedFile) return;
  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   const resp = await fetch("/api/upload", {
  //     method: "POST",

  //     body: formData,
  //   });
  //   if (!resp.ok) {
  //     toast({
  //       title: "Image upload error 'try again'",
  //       variant: "destructive",
  //     });
  //   } else {
  //     const { image_url } = await resp.json();

  //     setUploadedImage(image_url);
  //   }
  // };

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

                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <ReactFileDropZone
                          // image_url={}
                          onFileSelected={(acceptFile: File | undefined) => {
                            form.setValue("imageFile", acceptFile);
                          }}
                          selectedFile={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button disabled={loading} type="submit">
              {loading ? "loading..." : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
