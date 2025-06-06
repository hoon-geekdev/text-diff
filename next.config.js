const nextConfig = { 
  output: "export", 
  trailingSlash: false, 
  images: { unoptimized: true }, 
  basePath: process.env.NODE_ENV === 'production' ? '/text-diff' : '', 
  assetPrefix: process.env.NODE_ENV === 'production' ? '/text-diff' : '' 
}; 
module.exports = nextConfig;
