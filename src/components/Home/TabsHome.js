"use client";
import { Tabs } from "./tabs.tsx";

export function TabsDemo() {
  const tabs = [
    {
      title: "Dashboard",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Dashboard Page</p>
          <img
            src="/images/hero2.jpg"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top  absolute bottom-3 inset-x-0  rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Products",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Products Page</p>
          <img
            src="/images/hero3.jpg"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top  absolute bottom-3 inset-x-0  rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Dark Theme",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Dark Theme</p>
          <img
            src="/images/hero5.jpg"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top  absolute bottom-3 inset-x-0  rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Expense",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Expense Tab</p>
          <img
            src="/images/hero6.jpg"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top  absolute bottom-3 inset-x-0  rounded-xl mx-auto"
          />
        </div>
      ),
    },
    {
      title: "Product List",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Product List</p>
          <img
            src="/images/hero4.jpg"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top  absolute bottom-3 inset-x-0  rounded-xl mx-auto"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}
