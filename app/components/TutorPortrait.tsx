"use client";

import Image from "next/image";
import { useState } from "react";
import type { SuggestedTutor } from "../lib/suggestedTutors";

export default function TutorPortrait({ tutor }: { tutor: SuggestedTutor }) {
  const [failedPicture, setFailedPicture] = useState<string | null>(null);
  const src = failedPicture === tutor.picture ? tutor.fallbackPicture : tutor.picture;

  return (
    <Image
      src={src}
      alt={`Portrait of ${tutor.name}, MuseCool tutor`}
      fill
      sizes="(min-width: 1088px) 480px, (min-width: 1024px) calc((100vw - 128px) / 2), (min-width: 640px) 480px, calc(100vw - 32px)"
      loading="lazy"
      className="object-cover object-center"
      onError={() => {
        if (src !== tutor.fallbackPicture) setFailedPicture(tutor.picture);
      }}
    />
  );
}
