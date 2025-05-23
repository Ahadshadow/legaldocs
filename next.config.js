const path = require("path");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["legaldocs.unibyts.com"], // Add the external image domain here
  },
};
