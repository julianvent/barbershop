
import { getRandomQuote, getRandomQuoteFromRandomTag } from './integrations/quotes.client.js';

export const QuoteService = {
  async quoteRandom() {
    return getRandomQuote();
  },
  async quoteFromRandomTag() {
    return getRandomQuoteFromRandomTag();
  }
};
