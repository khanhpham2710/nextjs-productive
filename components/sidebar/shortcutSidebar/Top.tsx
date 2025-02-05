"use client";

import { CalendarDays, Clock, Home, Star, User } from "lucide-react";
import { SidebarLink, Props } from "./SidebarLink";


export const topSidebarLinks : Props[]= [
  {
    href: "/dashboard",
    Icon: Home,
    hoverTextKey: "HOME_HOVER",
  },
  {
    href: "/dashboard/pomodoro",
    include: "/dashboard/pomodoro",
    Icon: Clock,
    hoverTextKey: "POMODORO_HOVER",
  },
  {
    href: "/dashboard/calendar",
    Icon: CalendarDays,
    hoverTextKey: "CALENDAR_HOVER",
  },
  {
    href: "/dashboard/starred",
    Icon: Star,
    hoverTextKey: "STARRED_HOVER",
  },
  {
    href: "/dashboard/assigned-to-me",
    Icon: User,
    hoverTextKey: "ASSIGNED_TO_ME_HOVER",
  },
];


const Top = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      {topSidebarLinks.map((link, i) => (
        <SidebarLink
          key={`link_${i}`}
          Icon={link.Icon}
          hoverTextKey={link.hoverTextKey}
          href={link.href}
          include={link?.include}
        />
      ))}
    </div>
  );
};

export default Top