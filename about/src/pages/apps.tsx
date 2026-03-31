import Topbar from "../components/topbar";
import Footer from "../components/footer";
import { m } from "framer-motion";

const apps = Array.from({ length: 3 }, (_, index) => ({
  id: `app-${index + 1}`,
  name: `App ${index + 1}`,
}));

export default function Apps() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-display font-bold mb-12 chrome-text text-center">
            Bitsocial Apps
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <m.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.1 }}
                className="glass-card p-6 hover:border-muted-foreground/40 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                  {app.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  A Bitsocial-powered application. More apps coming soon!
                </p>
                <span className="text-blue-glow hover:text-blue-core transition-colors text-sm font-medium">
                  Learn more →
                </span>
              </m.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
