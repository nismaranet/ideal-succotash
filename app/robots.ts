import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://nismara.web.id'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Sembunyikan route privat dan API dari bot mesin pencari
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
