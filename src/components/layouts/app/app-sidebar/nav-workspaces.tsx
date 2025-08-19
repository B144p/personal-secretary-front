import {
  ChevronRight,
  CircleArrowUp,
  CircleCheck,
  CircleFadingArrowUp,
  CirclePause,
  CircleX,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavWorkspaces({ workspaces }: INavWorkspacesProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarMenu>
        {workspaces.map((workspace) => (
          <SidebarMenuItem key={workspace.name}>
            <SidebarMenuButton asChild>
              <a href="#">
                {workspaceStatusIcon[workspace.status]}
                <span>{workspace.name}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction
              className="bg-sidebar-accent text-sidebar-accent-foreground left-2 data-[state=open]:rotate-90"
              showOnHover
            >
              <ChevronRight />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

interface INavWorkspacesProps {
  workspaces: Array<IWorkspace>;
}

interface IWorkspace {
  name: string;
  status: "todo" | "inProgress" | "done" | "close" | "hold";
}

const workspaceStatusIcon: Record<IWorkspace["status"], React.ReactNode> = {
  todo: <CircleArrowUp color={"oklch(0.922 0 0)"} />,
  inProgress: <CircleFadingArrowUp color={"oklch(0.623 0.214 259.815)"} />,
  done: <CircleCheck color={"oklch(0.648 0.2 131.684)"} />,
  close: <CircleX color={"oklch(0.637 0.237 25.331)"} />,
  hold: <CirclePause color={"oklch(0.795 0.184 86.047)"} />,
};
