const isProd = process.env.NODE_ENV === 'production';

const nextConfig = { 
  output: "export", 
  trailingSlash: false, 
  images: { unoptimized: true },
  basePath: isProd ? '/text-diff' : '',
  assetPrefix: isProd ? '/text-diff' : ''
}; 
module.exports = nextConfig;
