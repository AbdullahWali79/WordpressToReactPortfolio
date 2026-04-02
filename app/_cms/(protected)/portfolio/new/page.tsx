import { PortfolioForm } from "@/components/cms/forms/portfolio-form";
import { createPortfolioAction } from "@/lib/cms/actions/portfolio-actions";

export default function NewPortfolioPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Add Project</h1>
      <PortfolioForm action={createPortfolioAction} />
    </div>
  );
}
