import { useTranslation } from "react-i18next";
import { ArrowUp, MessageSquare } from "lucide-react";
import AppTagPill from "@/components/app-tag-pill";
import { cn } from "@/lib/utils";

interface BlogFlairLike {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface BlogCommentLike {
  cid?: string;
  title?: string;
  content?: string;
  link?: string;
  linkHtmlTagName?: string;
  spoiler?: boolean;
  timestamp?: number;
  upvoteCount?: number;
  downvoteCount?: number;
  replyCount?: number;
  childCount?: number;
  author?: { displayName?: string; address?: string };
  flair?: BlogFlairLike;
  flairs?: BlogFlairLike[];
}

interface BlogPostCardProps {
  post: BlogCommentLike;
  activeFlair?: string | null;
  onFlairSelect?: (flair: string) => void;
  buildFlairHref?: (flair: string | null) => string;
}

function formatRelativeTime(
  timestamp: number | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  if (!timestamp) return "";
  const nowSec = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, nowSec - timestamp);
  if (diff < 60) return t("blog.time.justNow");
  if (diff < 3600) {
    const n = Math.floor(diff / 60);
    return t(n === 1 ? "blog.time.minute" : "blog.time.minutes", { count: n });
  }
  if (diff < 86400) {
    const n = Math.floor(diff / 3600);
    return t(n === 1 ? "blog.time.hour" : "blog.time.hours", { count: n });
  }
  if (diff < 2592000) {
    const n = Math.floor(diff / 86400);
    return t(n === 1 ? "blog.time.day" : "blog.time.days", { count: n });
  }
  if (diff < 31536000) {
    const n = Math.floor(diff / 2592000);
    return t(n === 1 ? "blog.time.month" : "blog.time.months", { count: n });
  }
  const n = Math.floor(diff / 31536000);
  return t(n === 1 ? "blog.time.year" : "blog.time.years", { count: n });
}

function isImageLink(post: BlogCommentLike): boolean {
  const link = post.link;
  if (!link) return false;
  if (post.linkHtmlTagName === "img") return true;
  return /\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i.test(link);
}

function getFlair(post: BlogCommentLike): BlogFlairLike | undefined {
  return post.flair ?? post.flairs?.[0];
}

export default function BlogPostCard({
  post,
  activeFlair = null,
  onFlairSelect,
  buildFlairHref,
}: BlogPostCardProps) {
  const { t } = useTranslation();
  const flair = getFlair(post);
  const flairText = flair?.text ?? null;
  const title = post.title?.trim() || t("blog.untitled");
  const author = post.author?.displayName || post.author?.address || t("blog.anonymous");
  const upvoteCount = post.upvoteCount ?? 0;
  const downvoteCount = post.downvoteCount ?? 0;
  const score = upvoteCount - downvoteCount;
  const replyCount = post.replyCount ?? post.childCount ?? 0;
  const relative = formatRelativeTime(post.timestamp, t);
  const showImage = isImageLink(post);

  return (
    <article className="glass-card flex flex-col gap-4 overflow-hidden p-5 md:p-6">
      <header className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {flairText ? (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: flair?.backgroundColor ?? "rgba(37,99,235,0.16)",
              color: flair?.textColor ?? "var(--foreground)",
            }}
          >
            {flairText}
          </span>
        ) : null}
        <span className="font-medium text-foreground/70">{author}</span>
        {relative ? <span aria-hidden="true">·</span> : null}
        {relative ? <span>{relative}</span> : null}
      </header>

      <h2 className="font-display text-2xl leading-tight md:text-3xl">
        <span className="text-foreground">{title}</span>
      </h2>

      {showImage && post.link ? (
        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-2xl border border-border/50 bg-foreground/[0.02]"
        >
          <img
            src={post.link}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn("h-full w-full object-cover", post.spoiler ? "blur-xl" : "")}
            style={{ maxHeight: 360 }}
          />
        </a>
      ) : null}

      {post.content ? (
        <p className="text-sm leading-6 text-muted-foreground">
          <span className="line-clamp-4 whitespace-pre-line">{post.content}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ArrowUp className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground/75">{score}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground/75">
              {t("blog.replies", { count: replyCount })}
            </span>
          </span>
          {flairText ? (
            <AppTagPill
              active={activeFlair?.toLowerCase() === flairText.toLowerCase()}
              href={
                onFlairSelect
                  ? undefined
                  : buildFlairHref
                    ? buildFlairHref(flairText)
                    : `/blog?tag=${encodeURIComponent(flairText)}`
              }
              label={flairText}
              onClick={onFlairSelect ? () => onFlairSelect(flairText) : undefined}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
