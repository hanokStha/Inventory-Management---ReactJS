import React from "react";
import { HeroParallaxDemo } from "./LayoutHome";
import { Tabs } from "./tabs.tsx";
import { TabsDemo } from "./TabsHome.js";
import { SVGMaskEffectDemo } from "./MaskEffect.tsx";

const HomePage = () => {
  return (
    <div>
      <HeroParallaxDemo /> <TabsDemo /> <SVGMaskEffectDemo />
    </div>
  );
};

export default HomePage;
