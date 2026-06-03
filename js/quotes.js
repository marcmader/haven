/**
 * Fetch quotes from quotes.json.
 * @returns {Promise<Array<{text: string, author: string|null}>>}
 */
export async function loadQuotes() {
  const res = await fetch('./quotes.json');
  if (!res.ok) throw new Error(`Failed to load quotes: ${res.status}`);
  return res.json();
}

/**
 * Select today's quote deterministically.
 * Same quote is shown for the entire day.
 * @param {Array} quotes
 * @returns {{text: string, author: string|null}}
 */
export function getDailyQuote(quotes) {
  const dayIndex = Math.floor(Date.now() / 86400000) % quotes.length;
  return quotes[dayIndex];
}

/**
 * Render a quote into the topbar DOM elements.
 * If author is null, the author element is hidden.
 * @param {{text: string, author: string|null}} quote
 * @param {{ textEl: HTMLElement, authorEl: HTMLElement }} elements
 */
export function renderQuote(quote, elements) {
  elements.textEl.textContent = quote.text;
  if (quote.author) {
    elements.authorEl.textContent = `— ${quote.author}`;
    elements.authorEl.style.display = '';
  } else {
    elements.authorEl.textContent = '';
    elements.authorEl.style.display = 'none';
  }
}