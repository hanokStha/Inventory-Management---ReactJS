"use client";

import { MaskContainer } from "./svg-mask-effect.tsx";

export function SVGMaskEffectDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center  overflow-hidden">
      <MaskContainer
        revealText={
          <p className="max-w-4xl mx-auto text-slate-800 text-center  text-4xl font-bold">
            Elevate Your Inventory Management: Simplify Stock Control, Maximize
            Efficiency, and Drive Business Growth.
          </p>
        }
        className="h-[40rem] w-full border rounded-md"
      >
        Our Solution Delivers{" "}
        <span className="text-red-500">Seamless Integration </span> , Expertise,
        and Innovation to Empower Your{" "}
        <span className="text-red-500">Success.</span>
      </MaskContainer>
    </div>
  );
}
