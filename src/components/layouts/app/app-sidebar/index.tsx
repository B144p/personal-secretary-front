"use client";

import {
  AudioWaveform,
  Calendar,
  Command,
  LayoutDashboard,
  Search,
  Settings2,
  SquarePlus,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { NavFavorites } from "@/components/layouts/app/app-sidebar/nav-favorites";
import { NavHead } from "@/components/layouts/app/app-sidebar/nav-head";
import { NavTail } from "@/components/layouts/app/app-sidebar/nav-tail";
import { NavWorkspaces } from "@/components/layouts/app/app-sidebar/nav-workspaces";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenuButton asChild className="w-fit px-1.5">
          <a href={"#"}>
            <AudioWaveform className="size-3" />
            <span className="truncate font-bold">Personal Secretary</span>
          </a>
        </SidebarMenuButton>
        <NavHead items={mockupData.mainList} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={mockupData.favorites} showLimit={5} />
        <NavWorkspaces workspaces={mockupData.workspaces} />
      </SidebarContent>
      <SidebarFooter>
        <NavTail items={mockupData.secondaryList} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}

const mockupData = {
  teams: [
    { name: "Acme Inc", logo: Command, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  mainList: [
    { title: "New Plan", url: "#", icon: SquarePlus, isActive: true },
    { title: "Dashboard", url: "#", icon: LayoutDashboard },
    { title: "Search", url: "#", icon: Search },
  ],
  secondaryList: [
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Settings", url: "#", icon: Settings2 },
    { title: "Trash", url: "#", icon: Trash2 },
  ],
  favorites: [
    { name: "Project Management & Task Tracking", url: "#" },
    { name: "Family Recipe Collection & Meal Planning", url: "#" },
    { name: "Fitness Tracker & Workout Routines", url: "#" },
    { name: "Book Notes & Reading List", url: "#" },
    { name: "Sustainable Gardening Tips & Plant Care", url: "#" },
    { name: "Language Learning Progress & Resources", url: "#" },
    { name: "Home Renovation Ideas & Budget Tracker", url: "#" },
    { name: "Personal Finance & Investment Portfolio", url: "#" },
    { name: "Movie & TV Show Watchlist with Reviews", url: "#" },
    { name: "Daily Habit Tracker & Goal Setting", url: "#" },
  ],
  workspaces: [
    { name: "Personal Life Management", status: "todo" },
    { name: "Professional Development", status: "inProgress" },
    { name: "Creative Projects", status: "done" },
    { name: "Home Management", status: "close" },
    { name: "Travel & Adventure", status: "hold" },
  ] satisfies React.ComponentProps<typeof NavWorkspaces>["workspaces"],
};
