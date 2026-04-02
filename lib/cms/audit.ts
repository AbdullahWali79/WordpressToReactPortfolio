import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuditInput = {
  userId: string;
  actionType: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
};

export async function logAuditEvent(input: AuditInput) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("audit_logs").insert({
    user_id: input.userId,
    action_type: input.actionType,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    details: input.details ?? {},
  });
}
