import { lazy, Suspense } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import Footer from "@/components/footer";
import Topbar from "@/components/topbar";
import { BLOG_COMMUNITY_ADDRESS } from "@/lib/blog-community";

const BlogFeed = lazy(() => import("@/components/blog-feed"));

const ADDRESS_CLASSNAME = "italic font-medium text-foreground/80";
const BLOG_FEED_SKELETON_IDS = ["skeleton-a", "skeleton-b", "skeleton-c"];

function BlogIntro() {
  return (
    <section className="mb-6">
      <p className="text-xs font-display uppercase tracking-[0.2em] text-foreground/45">
        <Trans i18nKey="blog.sectionLabel" />
      </p>
      <div className="mt-4 max-w-2xl">
        <h1 className="optical-display-start text-4xl font-display font-semibold leading-[1.1] text-balance text-muted-foreground md:text-6xl lg:text-7xl">
          <Trans i18nKey="blog.title" />
        </h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg text-balance leading-relaxed text-muted-foreground">
          <Trans
            i18nKey="blog.subtitle"
            values={{ address: BLOG_COMMUNITY_ADDRESS }}
            components={{
              devs: (
                <Link
                  to="/about"
                  className="font-medium text-foreground/85 underline decoration-blue-glow/40 decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:decoration-blue-glow"
                />
              ),
              address: <em className={ADDRESS_CLASSNAME} />,
            }}
          />
        </p>
      </div>
    </section>
  );
}

function BlogFeedLoading() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div aria-hidden="true" className="glass-card h-20 animate-pulse p-4 md:p-5" />
      {BLOG_FEED_SKELETON_IDS.map((skeletonId) => (
        <div
          key={skeletonId}
          aria-hidden="true"
          className="glass-card animate-pulse space-y-4 p-5 md:p-6"
        >
          <div className="h-3 w-32 rounded-full bg-foreground/10" />
          <div className="h-6 w-3/4 rounded-full bg-foreground/15" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-foreground/10" />
            <div className="h-3 w-5/6 rounded-full bg-foreground/10" />
            <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Blog() {
  return (
    <div className="blog-page min-h-screen overflow-x-hidden">
      <Topbar />
      <main className="px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <BlogIntro />
          <Suspense fallback={<BlogFeedLoading />}>
            <BlogFeed />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
