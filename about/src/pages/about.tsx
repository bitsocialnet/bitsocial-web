import Topbar from "../components/topbar";
import Footer from "../components/footer";

export default function About() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-display font-bold mb-8 chrome-text">About Bitsocial</h1>
          <div className="glass-card p-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bitsocial is an open-source peer-to-peer protocol for social applications. Our mission
              is to decentralize social media by giving users and communities full ownership through
              cryptographic property rights.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              More about the project story and team coming soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
