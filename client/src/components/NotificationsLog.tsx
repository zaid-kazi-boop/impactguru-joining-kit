import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Loader2, Bell } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsLog() {
  const { data: notifications = [], isLoading } = trpc.joiningKit.getNotifications.useQuery();

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <div>
            <CardTitle>Notification Log</CardTitle>
            <CardDescription>All owner notifications about joining kit submissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-spin" />
            <p className="text-slate-600">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">#{notification.submissionId}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{notification.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(notification.status)}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {formatDate(notification.sentAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No notifications yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
