import { bn } from "@/lib/i18n/bn";
import { getGithubRepoPublicUrl, getMetadataBase } from "@/lib/seo";

/**
 * WebSite + Organization JSON-LD for search engines.
 * @see https://schema.org
 */
export function JsonLd() {
  const base = getMetadataBase().origin;
  const repoUrl = getGithubRepoPublicUrl();
  const sameAs = repoUrl ? [repoUrl] : undefined;

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: bn.meta.title,
      alternateName: "Server Deploy Guide",
      description: bn.meta.description,
      url: base,
      inLanguage: ["bn", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Server Deploy Guide",
      url: base,
      ...(sameAs ? { sameAs } : {}),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@graph": graph }) }}
    />
  );
}
