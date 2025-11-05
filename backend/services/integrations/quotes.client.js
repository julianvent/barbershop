
// Documentation: https://thequoteshub.com/api/docs/ 
const BASE_URL = 'https://thequoteshub.com/api';
const TIMEOUT_MS = 10_000;

export async function getRandomQuote() {
  const url = `${BASE_URL}/random-quote?format=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Quote API ${res.status} ${url}`);
  }

  const quote = await res.json();
  return quote;
}


export async function getRandomQuoteFromRandomTag() {
  const tagsUrl = `${BASE_URL}/tags?format=json`;

  const tagsRes = await fetch(tagsUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!tagsRes.ok) {
    throw new Error(`Quote API ${tagsRes.status} ${tagsUrl}`);
  }

  const tagsPayload = await tagsRes.json();
  const tags = Array.isArray(tagsPayload?.tags) ? tagsPayload.tags : [];
  if (tags.length === 0) {
    throw new Error('No tags available');
  }

  const tag = tags[Math.floor(Math.random() * tags.length)];
  const tagId = tag.tag_id;

  const byTagUrl = `${BASE_URL}/tags/${encodeURIComponent(tagId)}?format=json`;

  const byTagRes = await fetch(byTagUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!byTagRes.ok) {
    throw new Error(`Quote API ${byTagRes.status} ${byTagUrl}`);
  }

  const quotesPayload = await byTagRes.json();
  const quotes = Array.isArray(quotesPayload?.quotes) ? quotesPayload.quotes : [];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return quote;
}
