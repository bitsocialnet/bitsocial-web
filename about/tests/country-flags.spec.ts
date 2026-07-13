import { expect, test } from "@playwright/test";
import { getCountryFlagEmoji, normalizeCountryCode } from "../src/lib/country-flags";

test.describe("country flag emoji", () => {
  test("converts ISO country codes to regional indicator emoji", () => {
    expect(getCountryFlagEmoji("us")).toBe("🇺🇸");
    expect(getCountryFlagEmoji("VN")).toBe("🇻🇳");
  });

  test("normalizes the UK alias and rejects malformed country codes", () => {
    expect(normalizeCountryCode(" uk ")).toBe("gb");
    expect(getCountryFlagEmoji("uk")).toBe("🇬🇧");
    expect(getCountryFlagEmoji("usa")).toBeUndefined();
    expect(getCountryFlagEmoji(undefined)).toBeUndefined();
  });
});
