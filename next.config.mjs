const isDevelopment = process.env.NODE_ENV === "development";
const storageOrigin = process.env.S3_ENDPOINT
  ? new URL(process.env.S3_ENDPOINT).origin
  : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${storageOrigin ? ` ${storageOrigin}` : ""}`,
  "font-src 'self'",
  `connect-src 'self'${storageOrigin ? ` ${storageOrigin}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

/** @type {import("next").NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(), payment=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          ...(isDevelopment
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
