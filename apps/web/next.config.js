/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    experimental: {
        authInterrupts: true,
    },
    images: {
        domains: ["localhost"], // add image domains
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.plugins = [...config.plugins];
        }
        return config;
    },
};

export default nextConfig;