import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "./ui/button";

import { Image, Trash } from "lucide-react";

export default function ReactFileDropZone({
  image_url,
  selectedFile,
  onFileSelected,
}: {
  image_url?: string;
  selectedFile: File | undefined;
  onFileSelected: (acceptFile: File | undefined) => void;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      onFileSelected(acceptedFiles[0]);
    },
  });
  // console.log(selectedFile);
  return (
    <Card>
      <CardHeader>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <div className="border  border-border rounded-md p-4 flex flex-col gap-2 justify-center items-center">
            <Image size={60} />
            <p className=" text-center text-xs">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {selectedFile ? (
            <div className=" flex justify-center relative">
              <Button
                onClick={() => onFileSelected(undefined)}
                size={"icon"}
                className="absolute right-0"
              >
                <Trash />
              </Button>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt=""
                className="w-24 sm:w-32 aspect-square object-center"
              />
            </div>
          ) : (
            <div className=" flex justify-center relative">
              {image_url && (
                <img
                  src={image_url}
                  alt=""
                  className="w-24 sm:w-32 aspect-square object-center"
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
