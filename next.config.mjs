/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
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
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful images
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash images (fallback)
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Unsplash plus images
      },
    ],
  },
  // Add dependency resolution tolerance
  transpilePackages: ['framer-motion', '@heroicons/react', 'react-masonry-css', 'react-safe'],
  // Enable external directories (for monorepo support)
  modularizeImports: {
    '@heroicons/react': {
      transform: '@heroicons/react/{{member}}',
    },
  },
  env: {
    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    // Contentful CMS
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    // Authentication
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    // Unsplash (for fallback/migration)
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
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
    
    // Force React resolution to use the same version and resolve framer-motion conflicts
    config.resolve.alias = {
      ...config.resolve.alias,
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
