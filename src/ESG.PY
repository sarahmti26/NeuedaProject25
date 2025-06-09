import yfinance as yf
from flask import Flask, request, jsonify
import threading

app = Flask(__name__)

def get_esg_scores(ticker):
    stock = yf.Ticker(ticker)
    esg_data = stock.sustainability
    if esg_data is not None and not esg_data.empty:
        def get_value(key):
            try:
                value = esg_data.loc[key][0]
                return value if value is not None else 'N/A'
            except Exception:
                return 'N/A'
        
        esg_risk_rating = get_value('totalEsg')
        environment_score = get_value('environmentScore')
        social_score = get_value('socialScore')
        governance_score = get_value('governanceScore')
        esg_performance = get_value('esgPerformance')
        
        print(f"┌─────────────────────────────┬────────┐")
        print(f"│           (key)             │ value  │")
        print(f"├─────────────────────────────┼────────┤")
        print(f"│ ESG Risk Rating             │ {esg_risk_rating:<6} │")
        print(f"│ Environment Risk Score      │ {environment_score:<6} │")
        print(f"│ Social Risk Score           │ {social_score:<6} │")
        print(f"│ Governance Risk Score       │ {governance_score:<6} │")
        print(f"│ ESG Performance             │ {esg_performance:<6} │")
        print(f"└─────────────────────────────┴────────┘")
    else:
        print(f"No ESG data found for {ticker}.")

@app.route('/esg', methods=['GET'])
def esg_api():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'No ticker provided'}), 400

    stock = yf.Ticker(ticker)
    esg_data = stock.sustainability
    if esg_data is not None and not esg_data.empty:
        def get_value(key):
            try:
                value = esg_data.loc[key][0]
                return value if value is not None else 'N/A'
            except Exception:
                return 'N/A'
        return jsonify({
            'ticker': ticker,
            'esg_risk_rating': get_value('totalEsg'),
            'environment_score': get_value('environmentScore'),
            'social_score': get_value('socialScore'),
            'governance_score': get_value('governanceScore'),
            'esg_performance': get_value('esgPerformance')
        })
    else:
        return jsonify({'error': f'No ESG data found for {ticker}'}), 404

def run_flask():
    app.run(port=5001)

if __name__ == '__main__':
    threading.Thread(target=run_flask).start()
    get_esg_scores("AAPL")
    get_esg_scores("TSLA")
