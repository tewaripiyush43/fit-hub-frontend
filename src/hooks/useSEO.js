import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateSEO } from "../utils/seoHelper";

/**
 * React Hook to set page-specific SEO meta tags, title, and canonical links.
 * @param {Object} seoConfig
 * @param {string} seoConfig.title - Document title
 * @param {string} [seoConfig.description] - Meta description
 * @param {string} [seoConfig.image] - OpenGraph / Twitter card image
 * @param {string} [seoConfig.type] - og:type (website, article)
 * @param {string} [seoConfig.keywords] - Keywords
 */
export function useSEO({
  title,
  description,
  image,
  type = "website",
  keywords,
} = {}) {
  const location = useLocation();

  useEffect(() => {
    updateSEO({
      title,
      description,
      pathname: location.pathname + location.search,
      image,
      type,
      keywords,
    });
  }, [title, description, image, type, keywords, location.pathname, location.search]);
}

export default useSEO;
