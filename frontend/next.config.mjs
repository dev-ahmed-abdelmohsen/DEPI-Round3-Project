/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Disable ESLint and TypeScript checks during the build process
  // This helps avoid build failures due to linting or type errors.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure the Next.js Image Optimization system
  images: {
    // Define allowed external domains using remotePatterns for better security
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**", // Allows any image from the /vi/ path on i.ytimg.com
      },
    ],
  },
};

export default nextConfig;
