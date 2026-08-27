/**
 * Dynamic SEO and Meta Tag Management Utility
 * Updates document head tags (title, description, canonical, OpenGraph, Twitter cards)
 * on client-side route transitions to maximize Google indexing and social preview fidelity.
 */

const SITE_NAME = "FitHub";
const BASE_URL = "https://fit-hubb.netlify.app";
const DEFAULT_IMAGE = `${BASE_URL}/Modern%20Gym%20and%20Fitness%20Center%20Logo.png`;
const DEFAULT_DESCRIPTION =
  "FitHub is an AI workout generator, workout tracker, and exercise library with 1,300+ animated guides, 2D muscle anatomy maps, and healthy nutrition recipes.";

function updateMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateCanonicalUrl(url) {
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute("href", url);
}

/**
 * Update all SEO metadata for a given route/page
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} [options.description] - Meta description
 * @param {string} [options.pathname] - Relative path e.g. '/exercises/chest'
 * @param {string} [options.image] - OpenGraph / Twitter preview image URL
 * @param {string} [options.type] - og:type (website, article, etc.)
 * @param {string} [options.keywords] - Comma separated keywords
 */
export function updateSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  pathname = window.location.pathname,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords,
} = {}) {
  // 1. Title Tag
  const formattedTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - AI Workout Generator, Exercises & Fitness Recipes`;
  document.title = formattedTitle;

  // 2. Canonical URL
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const canonicalUrl = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  updateCanonicalUrl(canonicalUrl);

  // 3. Standard Meta Description & Keywords
  updateMetaTag("name", "description", description);
  if (keywords) {
    updateMetaTag("name", "keywords", keywords);
  }

  // 4. OpenGraph Tags (Facebook, LinkedIn, Discord, WhatsApp)
  updateMetaTag("property", "og:title", formattedTitle);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("property", "og:url", canonicalUrl);
  updateMetaTag("property", "og:image", image.startsWith("http") ? image : `${BASE_URL}${image}`);
  updateMetaTag("property", "og:type", type);
  updateMetaTag("property", "og:site_name", SITE_NAME);

  // 5. Twitter Card Tags
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "twitter:title", formattedTitle);
  updateMetaTag("name", "twitter:description", description);
  updateMetaTag("name", "twitter:image", image.startsWith("http") ? image : `${BASE_URL}${image}`);
}

export default updateSEO;
