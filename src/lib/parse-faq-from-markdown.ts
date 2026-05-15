export interface ParsedFaq {
  question: string;
  answer: string;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimTrailingMdHr(text: string): string {
  let t = text.trim();
  while (/(?:^|\n)\s*---\s*$/.test(t)) {
    t = t.replace(/(?:\n|^)\s*---\s*$/, '').trim();
  }
  return t;
}

/**
 * Finds `## Frequently Asked Questions` / `## FAQ` / `## FAQs` and parses `###` Q/A pairs until the next `##` section.
 * Used so FAQPage JSON-LD is emitted whenever the article body contains a standard FAQ block.
 */
export function parseFaqsFromMarkdown(markdown: string): ParsedFaq[] {
  const md = markdown.replace(/\r\n/g, '\n');
  const header =
    /(?:^|\n)## (?:Frequently Asked Questions|FAQs?)\s*\n/i;
  const hm = header.exec(md);
  if (!hm) return [];

  const start = hm.index + hm[0].length;
  const rest = md.slice(start);
  const nextH2 = rest.search(/(?:^|\n)## [^#\s]/);
  let section = nextH2 === -1 ? rest : rest.slice(0, nextH2);
  section = trimTrailingMdHr(section);

  const faqs: ParsedFaq[] = [];
  const chunks = section.split(/\n(?=### )/);
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed.startsWith('###')) continue;
    const body = trimmed.replace(/^###\s*/, '');
    const nl = body.indexOf('\n');
    if (nl === -1) continue;
    const question = body.slice(0, nl).trim();
    let answerRaw = trimTrailingMdHr(body.slice(nl + 1));
    const answer = stripInlineMarkdown(answerRaw.replace(/\n+/g, ' '));
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}
