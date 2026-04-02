import { updateSettingsAction } from "@/lib/cms/actions/settings-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: settings } = await supabase.from("settings").select("*").limit(1).maybeSingle();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Site Settings</h1>
      <form action={updateSettingsAction} className="space-y-5 rounded-lg border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="site_name">Site Name</Label>
            <Input id="site_name" name="site_name" defaultValue={settings?.site_name ?? "Custom CMS"} required />
          </div>
          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input id="contact_email" name="contact_email" type="email" defaultValue={settings?.contact_email ?? ""} />
          </div>
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={settings?.logo_url ?? ""} />
          </div>
          <div>
            <Label htmlFor="favicon_url">Favicon URL</Label>
            <Input id="favicon_url" name="favicon_url" defaultValue={settings?.favicon_url ?? ""} />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" defaultValue={settings?.phone_number ?? ""} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={settings?.address ?? ""} />
          </div>
        </div>

        <div>
          <Label htmlFor="site_description">Site Description</Label>
          <Textarea id="site_description" name="site_description" rows={3} defaultValue={settings?.site_description ?? ""} />
        </div>
        <div>
          <Label htmlFor="footer_text">Footer Text</Label>
          <Input id="footer_text" name="footer_text" defaultValue={settings?.footer_text ?? ""} />
        </div>
        <div>
          <Label htmlFor="homepage_hero_content">Homepage Hero Content</Label>
          <Textarea
            id="homepage_hero_content"
            name="homepage_hero_content"
            rows={3}
            defaultValue={settings?.homepage_hero_content ?? ""}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="default_seo_title">Default SEO Title</Label>
            <Input id="default_seo_title" name="default_seo_title" defaultValue={settings?.default_seo_title ?? ""} />
          </div>
          <div>
            <Label htmlFor="default_og_image_url">Default OG Image URL</Label>
            <Input id="default_og_image_url" name="default_og_image_url" defaultValue={settings?.default_og_image_url ?? ""} />
          </div>
        </div>
        <div>
          <Label htmlFor="default_meta_description">Default Meta Description</Label>
          <Textarea
            id="default_meta_description"
            name="default_meta_description"
            rows={3}
            defaultValue={settings?.default_meta_description ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="social_links">Social Links JSON</Label>
          <Textarea
            id="social_links"
            name="social_links"
            rows={6}
            defaultValue={JSON.stringify(settings?.social_links ?? {}, null, 2)}
          />
        </div>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
