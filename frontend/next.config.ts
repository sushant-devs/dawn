import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading template thumbnails (and any other remote images) from
    // arbitrary hosts over HTTP or HTTPS. Tighten the hostname here if you
    // want to restrict to a specific S3 bucket / CDN later.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Skip Next.js's image optimizer entirely. The optimizer is a server-side
    // proxy that fetches the source image to resize/compress it; with our
    // backend serving images from LocalStack (e.g. 192.168.10.50:4566), the
    // Next.js server can't reliably reach it, so `<Image>` requests fail.
    // Letting the browser fetch the URL directly avoids the issue.
    unoptimized: true,
  },
};

export default nextConfig;
