require('dotenv').config();

module.exports = {
  // ESLint settings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript settings
  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'export',
};
