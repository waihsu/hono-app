import React from "react";

export default function TeamCard({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) {
  return (
    <div className="flex w-full justify-center items-center gap-2">
      <p className="text-xs sm:text-sm text-center  text-pretty hidden lg:flex">
        {name}
      </p>

      <img src={image_url} alt="" className="w-7 h-7  object-center" />
    </div>
  );
}
