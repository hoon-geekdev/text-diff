const nextConfig = { 
  output: "export", 
  trailingSlash: true, 
  images: { unoptimized: true }, 
  basePath: process.env.NODE_ENV === 'production' ? '/text-diff' : '', 
  assetPrefix: process.env.NODE_ENV === 'production' ? '/text-diff' : '' 
}; 
module.exports = nextConfig;
