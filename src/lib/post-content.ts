export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeBasicEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function uniqueId(base: string, seen: Map<string, number>) {
  const safeBase = base || 'section';
  const count = seen.get(safeBase) || 0;
  seen.set(safeBase, count + 1);
  return count === 0 ? safeBase : `${safeBase}-${count + 1}`;
}

export function preparePostContent(html: string) {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const htmlWithHeadingIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const existingId = attrs.match(/\sid=(["'])(.*?)\1/i)?.[2];
      const text = decodeBasicEntities(stripTags(inner));
      const id = existingId || uniqueId(slugifyHeading(text), seen);

      toc.push({ id, text, depth: level === '3' ? 3 : 2 });

      if (existingId) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: htmlWithHeadingIds, toc };
}

export function wordCountFromHtml(html: string) {
  const text = stripTags(html);
  if (!text) return 0;
  return text.split(/\s+/).length;
}
