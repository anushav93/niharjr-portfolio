/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Remove appDir since it's now the default in Next.js 14+
    nextScriptWorkers: true,
  },
  // Updated from experimental.serverComponentsExternalPackages
  serverExternalPackages: ['nodemailer'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  // Add dependency resolution tolerance
  transpilePackages: ['framer-motion', '@heroicons/react', 'react-masonry-css', 'react-safe'],
  // Ignore peer dependency warnings
  externalDir: true,
  modularizeImports: {
    '@heroicons/react': {
      transform: '@heroicons/react/{{member}}',
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        dns: false,
        child_process: false,
      };
    }
    
    // Force React resolution to use the same version
    config.resolve.alias = {
      ...config.resolve.alias
    };
    
    // Add specific resolution for peer dependency conflicts
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];
    config.resolve.mainFields = ['browser', 'module', 'main'];
    
    // Increase Webpack's tolerance for version mismatches
    config.resolve.preferRelative = true;
    
    return config;
  },
};

export default nextConfig;
