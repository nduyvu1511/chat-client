/**
 * @type {import('next').NextConfig}
 */
import withImages from "next-images"

export default withImages({
  reactStrictMode: false,
  images: {
    disableStaticImages: true,
    domains: [
      "quanly.exxe.vn",
      "yt3.ggpht.com",
      process.env.NEXT_PUBLIC_IMAGE_URL,
      process.env.NEXT_PUBLIC_NEWS_IMAGE,
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
})
