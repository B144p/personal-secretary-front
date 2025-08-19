import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MoreHorizontal } from "lucide-react";

import { ComponentProps } from "react";
import { NavFavorites } from "..";
import { MoreDialog } from "./dialog";

export const MoreButton = ({ favorites }: IMoreButton) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="text-sidebar-foreground/70">
        <MoreHorizontal />
        <span>More</span>
        <MoreDialog />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

type IMoreButton = Pick<ComponentProps<typeof NavFavorites>, "favorites">;
