import { useTranslation } from "react-i18next";
import { getRelatedApps, type AppData } from "@/lib/apps-data";
import AppCard from "@/components/app-card";

interface RelatedAppsProps {
  app: AppData;
}

export default function RelatedApps({ app }: RelatedAppsProps) {
  const { t } = useTranslation();
  const related = getRelatedApps(app).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-display font-semibold mb-4 text-foreground">
        {t("apps.relatedApps")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((relatedApp) => (
          <AppCard key={relatedApp.slug} app={relatedApp} compact />
        ))}
      </div>
    </div>
  );
}
