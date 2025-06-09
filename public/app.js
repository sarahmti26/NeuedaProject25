// This file contains the JavaScript code that implements the functionality of the ESG Portfolio Tracker. 
// It handles user interactions, manages the portfolio data, and updates the UI dynamically based on user input.

const portfolio = [];
const alerts = {
    "AAPL": "Recent controversy regarding environmental practices.",
    "TSLA": "Concerns about labor practices raised in recent news.",
    "XOM": "Facing backlash over lack of climate action commitments.",
    "MSFT": "Internal memo leaks suggest growing employee unrest.",
    "JNJ": "Legal scrutiny intensifies over product safety claims.",
    "AMZN": "Criticism mounts over warehouse working conditions.",
    "GOOGL": "Antitrust concerns rise amid ongoing federal investigations.",
    "META": "Data privacy issues surface following third-party breach.",
    "NVDA": "Allegations of supply chain labor violations emerge.",
    "JPM": "Governance shakeup as board members resign amid reform push."
};

async function fetchESGScore(ticker) {
    try {
        const response = await fetch(`http://localhost:5001/esg?ticker=${ticker}`);
        if (!response.ok) throw new Error('No ESG data found');
        const data = await response.json();
        return data;
    } catch (err) {
        return null;
    }
}

document.getElementById('stock-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const ticker = document.getElementById('ticker').value.toUpperCase();
    const allocation = parseFloat(document.getElementById('allocation').value);

    // Fetch ESG score from Python API
    const esgData = await fetchESGScore(ticker);
    portfolio.push({
        ticker,
        allocation,
        esgScore: esgData && esgData.esg_risk_rating !== 'N/A' ? esgData.esg_risk_rating : Math.floor(Math.random() * 101),
        environment: esgData ? esgData.environment_score : 'N/A',
        social: esgData ? esgData.social_score : 'N/A',
        governance: esgData ? esgData.governance_score : 'N/A'
    });
    updatePortfolio();
    document.getElementById('ticker').value = '';
    document.getElementById('allocation').value = '';
});

document.getElementById('upload-btn').addEventListener('click', async function() {
    const fileInput = document.getElementById('csv-upload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
            const csvData = event.target.result.split('\n');
            // Skip header if present
            for (let i = 1; i < csvData.length; i++) {
                const row = csvData[i].trim();
                if (!row) continue;
                const [ticker] = row.split(',');
                if (ticker) {
                    const upperTicker = ticker.trim().toUpperCase();
                    const esgData = await fetchESGScore(upperTicker);
                    portfolio.push({
                        ticker: upperTicker,
                        allocation: 1,
                        esgScore: esgData && esgData.esg_risk_rating !== 'N/A' ? esgData.esg_risk_rating : Math.floor(Math.random() * 101),
                        environment: esgData ? esgData.environment_score : 'N/A',
                        social: esgData ? esgData.social_score : 'N/A',
                        governance: esgData ? esgData.governance_score : 'N/A'
                    });
                }
            }
            updatePortfolio();
        };
        reader.readAsText(file);
    }
});

function updatePortfolio() {
    const portfolioBody = document.getElementById('portfolio-body');
    portfolioBody.innerHTML = '';
    let totalScore = 0;

    portfolio.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2">${item.ticker}</td>
            <td class="px-4 py-2">${item.allocation}</td>
            <td class="px-4 py-2">${item.esgScore}</td>
            <td class="px-4 py-2">E: ${item.environment} S: ${item.social} G: ${item.governance}</td>
            <td class="px-4 py-2">${alerts[item.ticker] || 'No recent controversies'}</td>
        `;
        portfolioBody.appendChild(row);
        totalScore += item.esgScore;
    });

    const averageScore = totalScore / portfolio.length || 0;
    document.getElementById('average-esg').innerText = averageScore.toFixed(2);
    updateAlerts();
}

function updateAlerts() {
    const alertsList = document.getElementById('alerts');
    alertsList.innerHTML = '';
    portfolio.forEach(item => {
        if (alerts[item.ticker]) {
            const listItem = document.createElement('li');
            listItem.innerText = `${item.ticker}: ${alerts[item.ticker]}`;
            alertsList.appendChild(listItem);
        }
    });
}