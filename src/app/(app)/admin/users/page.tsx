"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/use-me";
import {
  useAdminUsers,
  useApproveUser,
  useRejectUser,
} from "@/hooks/use-admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserStatus } from "@/lib/schemas";

function StatusBadge({ status }: { status: UserStatus }) {
  const variants: Record<
    UserStatus,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    ADMIN: "outline",
    APPROVED: "default",
    PENDING: "secondary",
    REJECTED: "destructive",
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading } = useMe();
  const { data: users, isLoading, error } = useAdminUsers();
  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();

  useEffect(() => {
    if (!meLoading && me && me.status !== "ADMIN") {
      router.replace("/plans");
    }
  }, [me, meLoading, router]);

  if (meLoading || !me) return null;
  if (me.status !== "ADMIN") return null;

  if (isLoading) {
    return <p className="text-muted-foreground">Loading users…</p>;
  }

  if (error) {
    return (
      <p className="text-destructive">Failed to load users. Please refresh.</p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name ?? "—"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                {user.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(user.id)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate(user.id)}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {user.status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectMutation.mutate(user.id)}
                    disabled={rejectMutation.isPending}
                  >
                    Revoke
                  </Button>
                )}
                {user.status === "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => approveMutation.mutate(user.id)}
                    disabled={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
