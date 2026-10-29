"use client";

import { useEffect, useRef, useState } from "react";

// Shows the founder photo, and falls back to initials if the image can't load.
export default function FounderAvatar({ photo, name, initials }: { photo: string; name: string; initials: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showPhoto = photo && !failed;

  // The image can fail before React is ready to hear about it, so check once after mount too.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="avatar" aria-hidden={showPhoto ? undefined : true}>
      {showPhoto ? <img ref={imgRef} src={photo} alt={name} onError={() => setFailed(true)} /> : initials}
    </div>
  );
}