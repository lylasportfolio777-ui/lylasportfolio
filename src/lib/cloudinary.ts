/**
 * Utility function to automatically optimize Cloudinary and external image URLs.
 * Injects f_auto (auto format AVIF/WebP), q_auto / q_auto:best (visually lossless for photography),
 * and width scaling to minimize image bytes while preserving 100% visual fidelity.
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  width = 1600,
  quality: "auto" | "best" | "good" = "best"
): string {
  if (!url || typeof url !== "string") return url;

  const qualityMode = quality === "best" ? "q_auto:best" : quality === "good" ? "q_auto:eco" : "q_auto";
  const widthParam = width > 0 ? `,w_${width}` : "";

  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto")) {
      return url.replace(/\/upload\/f_auto([^/]+)?\//, `/upload/f_auto,${qualityMode}${widthParam}/`);
    }
    return url.replace("/upload/", `/upload/f_auto,${qualityMode}${widthParam}/`);
  }

  // Convert external third-party images (e.g. Pinterest) via Cloudinary Fetch API
  if ((url.startsWith("http://") || url.startsWith("https://")) && !url.includes("cloudinary.com")) {
    return `https://res.cloudinary.com/duk94ehtq/image/fetch/f_auto,${qualityMode}${widthParam}/${url}`;
  }

  return url;
}
