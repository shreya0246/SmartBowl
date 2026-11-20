"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageProps extends Omit<React.ComponentPropsWithRef<typeof Image>, "src"> {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

export function FallbackImage({
  src,
  fallbackSrc,
  alt,
  className,
  ...props
}: ImageProps) {
  const [broken, setBroken] = useState(false);

  return (
    <Image
      {...props}
      src={broken ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      sizes="(max-width: 768px) 100vw, 1200px"
    />
  );
}
