import { useState } from "react";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, ArrowRight, Check } from "lucide-react";
import {
  isNewsletterConfigured,
  NewsletterConfigurationError,
  newsletterRequiresConfirmation,
  subscribeToNewsletter,
} from "@/lib/newsletter";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

export default function MailingList() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const normalizedEmail = email.trim();
  const isValid = normalizedEmail.includes("@") && normalizedEmail.includes(".");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedEmail || formState === "submitting" || !isNewsletterConfigured) return;

    setFormState("submitting");

    try {
      await subscribeToNewsletter(normalizedEmail);
      setFormState("success");
      setEmail("");
    } catch (error) {
      console.error("Newsletter signup failed", error);
      setFormState(error instanceof NewsletterConfigurationError ? "idle" : "error");
    }
  };

  const statusMessage =
    formState === "error"
      ? t("mailingList.error")
      : !isNewsletterConfigured
        ? t("mailingList.unavailable")
        : null;
  const successMessage = newsletterRequiresConfirmation
    ? t("mailingList.confirmationSent")
    : t("mailingList.success");

  return (
    <section id="mailing-list" className="py-20 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <m.div
          initial={{ y: 24 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-core/10 dark:bg-blue-core/20 mb-6">
            <Mail className="h-5 w-5 text-blue-glow" aria-hidden="true" />
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-normal mb-3 text-balance text-muted-foreground dark:text-foreground/85">
            {t("mailingList.title")}
          </h2>

          <p className="text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed text-muted-foreground">
            {t("mailingList.description")}
          </p>

          {formState === "success" ? (
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-blue-glow font-display font-medium"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>{successMessage}</span>
            </m.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1 min-w-0">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formState === "error") {
                      setFormState("idle");
                    }
                  }}
                  placeholder={t("mailingList.placeholder")}
                  aria-label={t("mailingList.inputLabel")}
                  className={cn(
                    "w-full rounded-full bg-foreground/[0.04] border border-foreground/[0.08] px-5 py-3 text-sm font-display",
                    "placeholder:text-muted-foreground/50",
                    "transition-[color,background-color] duration-200",
                  )}
                  disabled={formState === "submitting"}
                />
              </div>

              <button
                type="submit"
                disabled={formState === "submitting" || !isValid || !isNewsletterConfigured}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold text-sm",
                  "border border-blue-core/30 bg-blue-core/10 text-muted-foreground",
                  "hover:text-foreground hover:bg-blue-core/20 hover:border-blue-glow",
                  "ring-glow transition-[box-shadow,border-color,background-color,color,opacity] duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-blue-core/30 disabled:hover:bg-blue-core/10 disabled:hover:text-muted-foreground disabled:hover:shadow-none",
                  "dark:border-blue-core/55 dark:bg-blue-core/28 dark:hover:bg-blue-core/42",
                )}
              >
                {formState === "submitting" ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    {t("mailingList.subscribing")}
                  </span>
                ) : (
                  <>
                    {t("mailingList.subscribe")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          {statusMessage ? (
            <p
              aria-live="polite"
              className={cn(
                "mt-4 text-sm font-display",
                formState === "error" ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {statusMessage}
            </p>
          ) : null}

          <p className="text-xs mt-5 font-display text-muted-foreground">
            {t("mailingList.privacy")}
          </p>
        </m.div>
      </div>
    </section>
  );
}
