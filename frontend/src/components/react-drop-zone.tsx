import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { File } from "lucide-react";

export default function ReactFileDropZone({
  uploadedImage,
  setUploadedImage,
}: {
  uploadedImage: string;
  setUploadedImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setUploadedImage("");
      setFiles([acceptedFiles[0]]);
    },
  });
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    const resp = await fetch("/api/upload", {
      method: "POST",

      body: formData,
    });
    if (!resp.ok) {
      toast({
        title: "Image upload error 'try again'",
        variant: "destructive",
      });
    } else {
      const { image_url } = await resp.json();
      setUploadedImage(image_url);
    }
  };
  console.log(files);
  return (
    <Card>
      <CardHeader>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="border border-dashed border-primary rounded-md p-4 flex flex-col gap-2 justify-center items-center">
            <File size={30} />
            <p className=" text-center">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {uploadedImage ? (
          <img src={uploadedImage} alt="" />
        ) : (
          <div>
            {files?.length ? (
              <div className=" flex justify-center">
                <Button onClick={upload}>Upload Image</Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
