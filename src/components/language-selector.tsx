import { useState, useMemo } from "react"
import { Globe, Check, Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "bn", name: "বাংলা" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "fi", name: "Suomi" },
  { code: "fil", name: "Filipino" },
  { code: "fr", name: "Français" },
  { code: "he", name: "עברית", dir: "rtl" },
  { code: "hi", name: "हिन्दी" },
  { code: "hu", name: "Magyar" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "mr", name: "मराठी" },
  { code: "nl", name: "Nederlands" },
  { code: "no", name: "Norsk" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "ro", name: "Română" },
  { code: "ru", name: "Русский" },
  { code: "sq", name: "Shqip" },
  { code: "sv", name: "Svenska" },
  { code: "te", name: "తెలుగు" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "uk", name: "Українська" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "zh", name: "中文" },
]

export default function LanguageSelector({ mobile }: { mobile?: boolean }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[6] // Default to English

  const filteredLanguages = useMemo(
    () =>
      languages.filter(
        (lang) =>
          lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lang.code.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  )

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {mobile ? (
          <button className="flex items-center justify-center w-full rounded-full glass-card px-3 py-3 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all font-display text-sm">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span>{t("nav.language")}</span>
            </span>
          </button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 px-3 text-sm text-muted-foreground hover:bg-border/70 hover:text-foreground focus-visible:bg-border/70 font-display"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md [&>button]:rounded-full"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-muted-foreground">Select Language</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border border-input bg-background px-4 py-3 text-left transition-all hover:bg-secondary",
                    i18n.language === language.code &&
                      "border-blue-glow bg-secondary",
                  )}
                  dir={language.dir}
                >
                  <span className="font-medium text-muted-foreground">{language.name}</span>
                  {i18n.language === language.code && (
                    <Check className="h-4 w-4 text-blue-glow" />
                  )}
                </button>
              ))}
            </div>
            {filteredLanguages.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No languages found
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
