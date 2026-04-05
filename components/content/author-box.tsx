import { User } from "lucide-react";

interface AuthorBoxProps {
  author?: {
    name: string;
    avatar?: string | null;
    bio?: string | null;
    role?: string;
  };
  publishedAt?: string | null;
}

export function AuthorBox({ author, publishedAt }: AuthorBoxProps) {
  const defaultAuthor: AuthorBoxProps["author"] = {
    name: "Editorial Team",
    avatar: null,
    bio: "We create helpful content about web development, design, and digital marketing.",
    role: "Content Team",
  };

  const displayAuthor = author || defaultAuthor;

  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-6">
      <div className="flex-shrink-0">
        {displayAuthor.avatar ? (
          <img
            src={displayAuthor.avatar}
            alt={displayAuthor.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground">{displayAuthor.name}</h3>
          {displayAuthor.role && (
            <span className="text-xs text-muted-foreground">• {displayAuthor.role}</span>
          )}
        </div>
        
        {displayAuthor.bio && (
          <p className="text-sm text-muted-foreground">{displayAuthor.bio}</p>
        )}
        
        {publishedAt && (
          <p className="mt-2 text-xs text-muted-foreground">
            Published on {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
