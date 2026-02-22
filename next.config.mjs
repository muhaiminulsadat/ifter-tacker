/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  experimental: {
    allowedDevOrigins: ["192.168.0.103:3000", "localhost:3000"],
  },
};

export default nextConfig;
