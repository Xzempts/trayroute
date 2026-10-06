import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static files so the site can be served from a public domain.
  output: "export",
  trailingSlash: true,
  // The dev server is bound on 0.0.0.0; browsers open it as 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
