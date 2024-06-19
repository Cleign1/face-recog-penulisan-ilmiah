/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        baseURL: process.env.BASE_URL || '192.168.1.50:3000',
    },
};

export default nextConfig;
