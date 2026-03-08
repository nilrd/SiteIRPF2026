/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://irpf.qaplay.com.br",
  generateRobotsTxt: false,
  exclude: ["/painel-nb-2025", "/painel-nb-2025/*", "/api/*"],
  generateIndexSitemap: false,
};
