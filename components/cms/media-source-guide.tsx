import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const examples = [
  {
    title: "GitHub Images",
    body: "Use direct raw image links from GitHub. Example: raw.githubusercontent.com or githubusercontent.com.",
  },
  {
    title: "Google Drive Images",
    body: "Use a public direct-view link. Typical format: https://drive.google.com/uc?export=view&id=FILE_ID",
  },
  {
    title: "YouTube Videos",
    body: "Save the watch URL or short URL. Example: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID",
  },
  {
    title: "Canva Assets",
    body: "Use Canva public publish/share links only if they resolve publicly without login.",
  },
];

export function MediaSourceGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How URL Media Works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          This CMS does not upload files. Save a public image or video URL here first, then browse the saved library while
          editing posts, pages, or portfolio items.
        </p>
        <div className="space-y-3">
          {examples.map((item) => (
            <div key={item.title} className="rounded-md border p-3">
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-1">{item.body}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
