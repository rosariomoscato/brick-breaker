import { publicPages, site, siteUrl } from "@/lib/site";

export function GET() {
  const body = [
    `# ${site.name}`, "", `> ${site.description}`, "", "## Pagine / Pages", "",
    ...publicPages.map(({ path, title, summary }) => `- [${title}](${siteUrl}${path}): ${summary}`), "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
