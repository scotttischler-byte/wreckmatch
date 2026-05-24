/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-of-use",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/blog/what-to-do-after-car-accident-houston-tx",
        destination: "/car-accident-help-houston",
        permanent: true,
      },
      {
        source: "/blog/car-accident-miami-fl-insurance-pitfalls",
        destination: "/car-accident-help-miami",
        permanent: true,
      },
      // Legacy Gomega / old-site paths → current SEO routes
      { source: "/states", destination: "/blog", permanent: true },
      { source: "/states/:path*", destination: "/blog", permanent: true },
      { source: "/ai-visibility-accelerator", destination: "/blog", permanent: true },
      { source: "/ai-visibility-accelerator/:path*", destination: "/blog", permanent: true },
      { source: "/ai-accident-help", destination: "/blog", permanent: true },
      { source: "/ai-accident-help/:path*", destination: "/blog", permanent: true },
      { source: "/truck-accident-help", destination: "/blog", permanent: true },
      { source: "/truck-accident-help/:path*", destination: "/blog", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/car-accident-help-:slug",
        destination: "/car-accident-help/:slug",
      },
    ];
  },
};

export default nextConfig;
