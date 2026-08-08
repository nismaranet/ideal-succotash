import { MetadataRoute } from 'next'
import dbConnect from "@/lib/mongoose";
import { Lowongan } from "@/models/Lowongan";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://nismara.web.id'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lowongan`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const lowongans = await Lowongan.find({ status: "Open" }).select("slug updatedAt").lean();
    
    dynamicRoutes = lowongans.map((l: any) => ({
      url: `${baseUrl}/lowongan/${l.slug}`,
      lastModified: l.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Gagal mengambil sitemap dinamis:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
