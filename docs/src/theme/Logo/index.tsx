import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useThemeConfig, type NavbarLogo } from "@docusaurus/theme-common";
import ThemedImage from "@theme/ThemedImage";
import type { Props } from "@theme/Logo";

function LogoThemedImage({
  logo,
  alt,
  imageClassName,
}: {
  logo: NavbarLogo;
  alt: string;
  imageClassName?: string;
}) {
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const themedImage = (
    <ThemedImage
      className={logo.className}
      sources={sources}
      height={logo.height}
      width={logo.width}
      alt={alt}
      style={logo.style}
    />
  );

  return imageClassName ? <div className={imageClassName}>{themedImage}</div> : themedImage;
}

export default function Logo(props: Props): ReactNode {
  const {
    siteConfig: { title, customFields },
  } = useDocusaurusContext();
  const {
    navbar: { logo },
  } = useThemeConfig();

  const { imageClassName, titleClassName, ...propsRest } = props;
  const logoLink = useBaseUrl(logo?.href || "/");

  // Keep the visible brand label fixed to the canonical product name.
  const brandTitle =
    typeof customFields.navbarBrandTitle === "string" ? customFields.navbarBrandTitle : title;
  const fallbackAlt = brandTitle ? "" : title;
  const alt = logo?.alt ?? fallbackAlt;

  return (
    <Link to={logoLink} {...propsRest} {...(logo?.target && { target: logo.target })}>
      {logo && <LogoThemedImage logo={logo} alt={alt} imageClassName={imageClassName} />}
      {brandTitle ? <b className={titleClassName}>{brandTitle}</b> : null}
    </Link>
  );
}
