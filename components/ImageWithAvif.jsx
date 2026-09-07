"use client";
import Image from "next/image";
import React from "react";

export default function ImageWithAvif({
  src,
  alt,
  sizes,
  fill,
  className,
  loading,
  priority,
  ...props
}) {
  const avifSrc = src.replace(/\.(png|jpe?g|webp)$/i, ".avif");

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        fill={fill}
        className={className}
        loading={loading}
        priority={priority}
        {...props}
      />
    </picture>
  );
}
