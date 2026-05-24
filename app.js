const marketTopics = [
  {
    title: 'EV Battery Supply Chain in Asia',
    regions: ['China', 'South Korea', 'Japan'],
    sector: 'Automotive / Energy',
    summary:
      'Track lithium demand, processing capacity, and policy support shaping battery exports and pricing.',
    tags: ['ev', 'battery', 'lithium', 'asia', 'supply chain'],
  },
  {
    title: 'Coffee Export Competitiveness in Brazil',
    regions: ['Brazil', 'EU', 'US'],
    sector: 'Agriculture',
    summary:
      'Monitor weather impact, shipping costs, and consumer demand shifts across premium and mass segments.',
    tags: ['coffee', 'exports', 'brazil', 'agriculture', 'pricing'],
  },
  {
    title: 'AI Chip Demand and Data Center Expansion',
    regions: ['US', 'Taiwan', 'Singapore'],
    sector: 'Technology',
    summary:
      'Analyze server procurement trends, cloud CAPEX plans, and semiconductor lead-time pressure.',
    tags: ['ai', 'chips', 'semiconductor', 'data center', 'cloud'],
  },
  {
    title: 'Gold Demand Under Inflation Pressure',
    regions: ['Global', 'India', 'Middle East'],
    sector: 'Commodities',
    summary:
      'Evaluate central bank buying, retail investment demand, and currency volatility influence on gold.',
    tags: ['gold', 'inflation', 'commodities', 'investment'],
  },
  {
    title: 'Solar Policy and Utility-Scale Project Pipeline',
    regions: ['US', 'EU', 'India'],
    sector: 'Renewable Energy',
    summary:
      'Review permitting pace, tax incentives, and project finance costs affecting installations.',
    tags: ['solar', 'policy', 'renewables', 'energy'],
  },
];

const topicInput = document.getElementById('topicInput');
const searchBtn = document.getElementById('searchBtn');
const status = document.getElementById('status');
const results = document.getElementById('results');

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreTopic(queryTokens, topic) {
  const index = [topic.title, topic.summary, topic.sector, topic.tags.join(' '), topic.regions.join(' ')].join(' ').toLowerCase();
  return queryTokens.reduce((score, token) => (index.includes(token) ? score + 1 : score), 0);
}

function renderCards(items) {
  if (!items.length) {
    results.innerHTML = `
      <article class="empty">
        <strong>No direct matches.</strong>
        <p>Try broader keywords, such as “energy”, “exports”, or “technology”.</p>
      </article>`;
    return;
  }

  results.innerHTML = items
    .map(
      (item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <div class="meta">
          <span class="badge">${item.sector}</span>
          <span class="badge">${item.regions.join(' • ')}</span>
        </div>
        <p>${item.summary}</p>
      </article>`,
    )
    .join('');
}

function runSearch() {
  const query = topicInput.value.trim();

  if (!query) {
    status.textContent = 'Please type a few topic words to search.';
    renderCards([]);
    return;
  }

  const queryTokens = tokenize(query);
  const ranked = marketTopics
    .map((topic) => ({ topic, score: scoreTopic(queryTokens, topic) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.topic);

  status.textContent = `Found ${ranked.length} result${ranked.length === 1 ? '' : 's'} for “${query}”.`;
  renderCards(ranked);
}

searchBtn.addEventListener('click', runSearch);
topicInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runSearch();
});

renderCards(marketTopics);
status.textContent = 'Showing sample global market research topics. Start searching above.';
