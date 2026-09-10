from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import yfinance as yf

app = Flask(
    __name__,
    static_folder="../frontend",
    static_url_path=""
)

CORS(app)


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return send_from_directory("../frontend", "index.html")


# =========================
# API TEST
# =========================

@app.route("/api/test")
def test():
    return jsonify({
        "message": "MarketPulse API is working!"
    })


# =========================
# CRYPTO API
# =========================

@app.route("/api/crypto")
def crypto():

    url = "https://api.coingecko.com/api/v3/coins/markets"

    params = {
        "vs_currency": "usd",
        "ids": (
            "bitcoin,ethereum,solana,"
            "binancecoin,cardano,dogecoin,"
            "ripple,polkadot,litecoin,"
            "shiba-inu,toncoin,usd-coin"
        ),
        "order": "market_cap_desc",
        "per_page": 12,
        "page": 1,
        "sparkline": "false",
        "price_change_percentage": "24h"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        if response.status_code != 200:

            return jsonify({
                "error": "Unable to get cryptocurrency data"
            }), response.status_code

        return jsonify(response.json())

    except requests.exceptions.RequestException as e:

        return jsonify({
            "error": "Cryptocurrency API request failed",
            "details": str(e)
        }), 500


# =========================
# STOCK API
# =========================

@app.route("/api/stocks")
def stocks():

    symbols = {

        "RELIANCE.NS":
            "Reliance Industries",

        "TCS.NS":
            "Tata Consultancy Services",

        "INFY.NS":
            "Infosys",

        "HDFCBANK.NS":
            "HDFC Bank",

        "ICICIBANK.NS":
            "ICICI Bank",

        "SBIN.NS":
            "State Bank of India",

        "BHARTIARTL.NS":
            "Bharti Airtel",

        "ITC.NS":
            "ITC Limited",

        "LT.NS":
            "Larsen & Toubro",

        "WIPRO.NS":
            "Wipro"
    }

    stock_data = []

    for symbol, name in symbols.items():

        try:

            ticker = yf.Ticker(symbol)

            history = ticker.history(
                period="5d",
                interval="1d"
            )

            if history.empty:
                continue

            latest = history.iloc[-1]

            price = float(latest["Close"])
            high = float(latest["High"])
            low = float(latest["Low"])

            volume = int(latest["Volume"])

            if len(history) >= 2:

                previous = float(
                    history.iloc[-2]["Close"]
                )

                change = (
                    (price - previous)
                    / previous
                ) * 100

            else:

                change = 0

            stock_data.append({

                "symbol":
                    symbol.replace(".NS", ""),

                "name":
                    name,

                "price":
                    round(price, 2),

                "change":
                    round(change, 2),

                "high":
                    round(high, 2),

                "low":
                    round(low, 2),

                "volume":
                    volume

            })

        except Exception as e:

            print(
                f"Error loading {symbol}: {e}"
            )

    return jsonify(stock_data)


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(
        debug=True
    )