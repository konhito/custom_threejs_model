"use client";

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const BentoGrid = ({ children, className }) => {
  return (
    <div
      className={cn(
      "grid w-full auto-rows-[20rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl border border-[#183427]/15 bg-[#f7f8f4]",
      "transition-transform duration-500 ease-out hover:-translate-y-1",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-transform duration-300 group-hover:-translate-y-10">
      {Icon && (
        <Icon className="h-10 w-10 text-[#173322]" />
      )}
      <h3 className="text-xl font-semibold text-[#173322]">
        {name}
      </h3>
      <p className="max-w-lg text-[#405148]">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <a
        href={href}
        className="pointer-events-auto inline-flex items-center gap-1 text-sm font-semibold text-[#173322] underline decoration-[#173322]/30 underline-offset-4"
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </a>
    </div>
    <div className="pointer-events-none absolute inset-0 transition-colors duration-500 group-hover:bg-white/10" />
  </div>
);

export { BentoCard, BentoGrid };

