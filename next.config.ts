import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/certificate/**", search: "" },
    ],
  },
}

export default nextConfig
