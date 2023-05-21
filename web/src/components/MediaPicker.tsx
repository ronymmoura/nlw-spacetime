"use client";

import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  function onFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (!files) {
      return;
    }

    const previewUrl = URL.createObjectURL(files[0]);

    setPreview(previewUrl);
  }

  return (
    <>
      <input
        type="file"
        id="media"
        name="coverUrl"
        className="invisible h-0 w-0"
        accept="image/*"
        onChange={onFileSelected}
      />
      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  );
}
