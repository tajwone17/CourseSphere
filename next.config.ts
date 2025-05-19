import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "scontent.fzyl6-1.fna.fbcdn.net",
    ],
  },
};

export default withFlowbiteReact(nextConfig);
