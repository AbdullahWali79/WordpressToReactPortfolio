import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function AuditLogsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id,action_type,entity_type,entity_id,created_at,profiles(email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Audit Logs</h1>
      <div className="rounded-lg border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(logs ?? []).map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.action_type}</TableCell>
                <TableCell>{log.entity_type}</TableCell>
                <TableCell>{(log.profiles as { email?: string } | null)?.email || "-"}</TableCell>
                <TableCell>{log.entity_id || "-"}</TableCell>
                <TableCell>{formatDate(log.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
