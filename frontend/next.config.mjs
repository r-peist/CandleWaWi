/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true, // Typfehler während des Builds ignorieren
    },
    eslint: {
        ignoreDuringBuilds: true, // ESLint während des Builds ignorieren
    },
};

export default nextConfig;
