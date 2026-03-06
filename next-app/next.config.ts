import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import redirectsData from "./lib/data/redirects.json";

const nextConfig: NextConfig = {
  async redirects() {
    return redirectsData.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
  },
};

export default withPayload(nextConfig);
