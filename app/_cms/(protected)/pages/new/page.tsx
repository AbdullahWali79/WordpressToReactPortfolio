import { PageForm } from "@/components/cms/forms/page-form";
import { createCmsPageAction } from "@/lib/cms/actions/page-actions";

export default function NewCmsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Create Page</h1>
      <PageForm action={createCmsPageAction} />
    </div>
  );
}
