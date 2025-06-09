const yahooFinance = require('yahoo-finance2').default;

async function getESGScores(ticker) {
  try {
    const result = await yahooFinance.quoteSummary(ticker, { modules: ['sustainability'] });
    const sustainability = result.sustainability;
    if (!sustainability || !sustainability.scores) {
      console.log(`❌ No ESG data found for ${ticker}.`);
      return null;
    }
    const scores = {};
    Object.entries(sustainability.scores).forEach(([key, value]) => {
      scores[key] = value?.raw ?? value;
    });
    console.log(`✅ ESG Scores for ${ticker}:`);
    console.table(scores);
    return scores;
  } catch (error) {
    // Try to fetch available modules for more helpful debugging
    try {
      const result = await yahooFinance.quoteSummary(ticker);
      console.log(`Available modules for ${ticker}:`, Object.keys(result));
    } catch (e) {
      // Ignore
    }
    console.error(`❌ Error fetching ESG data for ${ticker}:`, error.message);
    return null;
  }
}

// Example usage:
getESGScores('AAPL'); // Replace with any ticker symbol
