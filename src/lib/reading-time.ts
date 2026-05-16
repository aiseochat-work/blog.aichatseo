const WORDS_PER_MINUTE = 200;

function wordCount(text: string): number {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

/** Strip HTML and estimate reading time at ~200 wpm. */
export function readingTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return Math.max(1, Math.round(wordCount(text) / WORDS_PER_MINUTE));
}

/** Rough word count for markdown/code (JSON-LD, etc.). */
export function wordCountFromMarkdown(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_|`]/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return wordCount(text);
}

/** Estimate reading time from markdown body at ~200 wpm. */
export function readingTimeMinutesFromMarkdown(markdown: string): number {
  return Math.max(1, Math.round(wordCountFromMarkdown(markdown) / WORDS_PER_MINUTE));
}
