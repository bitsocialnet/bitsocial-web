import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  configuredNewsletterListUuids,
  isNewsletterConfigured,
  newsletterRequiresConfirmation,
  newsletterSubscribeAction,
  subscribeToNewsletter,
  NewsletterConfigurationError,
} from "@/lib/newsletter";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

export default function MailingList() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const normalizedEmail = email.trim();
  const isValid = normalizedEmail.includes("@") && normalizedEmail.includes(".");

  const handleSubmit = async (event: React.FormEvent) => {
    if (formState === "submitting" || !isNewsletterConfigured) {
      event.preventDefault();
      return;
    }

    if (!normalizedEmail) {
      return;
    }

    event.preventDefault();
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
      ? t("mailingList.chainError")
      : !isNewsletterConfigured
        ? t("mailingList.unavailable")
        : null;
  const successMessage = newsletterRequiresConfirmation
    ? t("mailingList.confirmationSent")
    : t("mailingList.chainSuccess");

  return (
    <section id="mailing-list" className="nojs-target-highlight py-20 md:py-28 px-6 scroll-mt-24">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 md:p-12 text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-blue-core/20 bg-blue-core/[0.07] dark:border-blue-core/35 dark:bg-blue-core/[0.14]">
            <Mail
              className="h-5 w-5 text-foreground/78 dark:text-foreground/84"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-normal mb-3 text-balance text-muted-foreground dark:text-foreground/85">
            {t("mailingList.chainTitle")}
          </h2>

          <p className="text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed text-muted-foreground">
            {t("mailingList.chainDescription")}
          </p>

          {formState === "success" ? (
            <div className="flex items-center justify-center gap-2 font-display font-medium text-foreground/90">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <form
              action={newsletterSubscribeAction || undefined}
              method="post"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              {configuredNewsletterListUuids.map((listUuid) => (
                <input key={listUuid} type="hidden" name="list_uuids" value={listUuid} />
              ))}

              <div className="relative flex-1 min-w-0">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
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
                  "border border-blue-core/30 bg-blue-core/[0.08] text-foreground/90",
                  "hover:text-foreground hover:bg-blue-core/[0.14] hover:border-blue-glow",
                  "ring-glow cta-glow transition-[box-shadow,border-color,background-color,color,opacity] duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-blue-core/30 disabled:hover:bg-blue-core/[0.08] disabled:hover:text-foreground/90 disabled:hover:shadow-none",
                  "dark:border-blue-core/45 dark:bg-blue-core/[0.18] dark:hover:border-blue-glow dark:hover:bg-blue-core/[0.24]",
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
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
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
        </div>
      </div>
    </section>
  );
}
