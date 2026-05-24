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
