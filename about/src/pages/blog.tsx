import Topbar from "../components/topbar";
import Footer from "../components/footer";

export default function Blog() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="optical-display-start text-5xl font-display font-bold mb-8 chrome-text">
            Blog
          </h1>
          <div className="glass-card p-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Bitsocial blog will feature protocol updates, development progress, ecosystem
              news, and deep dives into the technology behind decentralized social media.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Posts are coming soon. Stay tuned!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
