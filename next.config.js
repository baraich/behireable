/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf',
    };
    return config;
  },
  images: {
    domains: [
      'media.licdn.com',
      'images.unsplash.com'
    ],
  },
};

export default nextConfig; 