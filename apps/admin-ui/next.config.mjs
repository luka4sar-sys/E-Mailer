const apiUrl = process.env.API_URL || "http://localhost:3000";

const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/admin.html",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
