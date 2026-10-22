"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const BentoGrid = ({ children, className }) => (
  <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-3", className)}>{children}</div>
);

const BentoCard = ({ name, className, Icon, description, href, cta, featured }) => (
  <a href={href} className={cn("home-path-card group", featured && "home-path-card--featured", className)}>
    <Icon className="home-path-card__icon" aria-hidden="true" strokeWidth={1.4} />
    <div className="home-path-card__copy">
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
    <span className="home-path-card__cta">{cta}<ArrowUpRight aria-hidden="true" size={18} /></span>
  </a>
);

export { BentoCard, BentoGrid };
