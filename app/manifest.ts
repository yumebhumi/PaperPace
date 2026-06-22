import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PaperPace",
    short_name: "PaperPace",
    description: "Train your reading habit.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#355c4b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
