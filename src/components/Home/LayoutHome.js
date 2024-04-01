"use client";
import React from "react";
import { HeroParallax } from "./hero-parallax.tsx";

export const products = [
  {
    title: "Moonbeam",
    link: "#",
    thumbnail: "/images/hero1.png",
  },
  {
    title: "Cursor",
    link: "#",
    thumbnail: "/images/hero2.jpg",
  },
  {
    title: "Rogue",
    link: "#",
    thumbnail: "/images/hero3.jpg",
  },

  {
    title: "Editorially",
    link: "#",
    thumbnail: "/images/hero4.jpg",
  },
  {
    title: "Editrix AI",
    link: "#",
    thumbnail: "/images/hero5.jpg",
  },
  {
    title: "Pixel Perfect",
    link: "#",
    thumbnail: "/images/hero6.jpg",
  },
  {
    title: "Moonbeam",
    link: "#",
    thumbnail: "/images/showcase1.png",
  },
  {
    title: "Cursor",
    link: "#",
    thumbnail: "/images/hero6.jpg",
  },
  {
    title: "Rogue",
    link: "#",
    thumbnail: "/images/hero3.jpg",
  },

  {
    title: "Editorially",
    link: "#",
    thumbnail: "/images/hero4.jpg",
  },
  {
    title: "Editrix AI",
    link: "#",
    thumbnail: "/images/hero5.jpg",
  },
  {
    title: "Pixel Perfect",
    link: "#",
    thumbnail: "/images/hero6.jpg",
  },
];

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
