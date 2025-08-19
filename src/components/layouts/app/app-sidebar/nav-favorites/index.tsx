import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ActionButton } from "./action";
import { MoreButton } from "./more-button";
import { useMemo } from "react";

export const NavFavorites = ({ favorites, showLimit }: INavFavoriteProps) => {
  const isOverLimit = useMemo<boolean>(
    () => favorites.length > showLimit,
    [favorites.length, showLimit]
  );

  if (favorites.length === 0) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.slice(0, showLimit).map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} title={item.name}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <ActionButton />
          </SidebarMenuItem>
        ))}
        {isOverLimit && <MoreButton favorites={favorites} />}
      </SidebarMenu>
    </SidebarGroup>
  );
};

interface INavFavoriteProps {
  favorites: Array<{
    name: string;
    url: string;
    emoji?: string;
  }>;
  showLimit: number;
}
