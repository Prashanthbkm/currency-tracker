# 💰 Currency Tracker API  

A robust Node.js backend API that tracks **USD → ARS (Argentinian Peso)** exchange rates from multiple financial sources in real-time.  
Built for the **Backend Development Internship Assignment**.

---

## 🚀 Features

- 🔁 **Real-time Data:** Fetches currency quotes from 3 trusted sources  
- 🕒 **Auto Updates:** Refreshes data every 60 seconds  
- 🧮 **Data Insights:** Calculates averages and slippage percentages  
- 💾 **Persistent Storage:** SQLite integration for saving quotes  
- ⚙️ **Production Ready:** Includes error handling and modular design  
- 🌐 **RESTful API:** Clean JSON endpoints for easy frontend integration  

---

## 📊 API Endpoints

### `GET /`
Returns basic API info and available endpoints.

### `GET /quotes`
Returns an array of current USD–ARS quotes from all sources.

```json
[
  {
    "buy_price": 140.3,
    "sell_price": 144.0,
    "source": "https://www.ambito.com/contenidos/dolar.html"
  }
]
GET /average

Returns average buy and sell prices across all sources.

{
  "average_buy_price": 142.3,
  "average_sell_price": 147.4
}

GET /slippage

Returns slippage percentages for each source compared to the average.

[
  {
    "buy_price_slippage": 0.04,
    "sell_price_slippage": -0.06,
    "source": "https://www.ambito.com/contenidos/dolar.html"
  }
]

🛠 Tech Stack
Category	Tools
Backend	Node.js, Express.js
Database	SQLite3
Web Scraping	Axios, Cheerio
Development	Nodemon
CORS	Enabled for frontend integration
📦 Installation
1️⃣ Clone the repository
git clone https://github.com/Prashanthbkm/currency-tracker.git
cd currency-tracker

2️⃣ Install dependencies
npm install

3️⃣ Start the development server
npm run dev

4️⃣ Start the production server
npm start


✅ The API will be available at:
http://localhost:3000

🧱 Project Structure
currency-tracker/
├── index.js          # Main server file
├── database.js       # SQLite database configuration
├── scraper.js        # Web scraping logic
├── dataService.js    # Business logic & data processing
├── package.json      # Dependencies & scripts
└── currency.db       # SQLite database (auto-generated)

💡 Key Implementation Details
🕒 Data Freshness

Quotes auto-update every 60 seconds

Cached data ensures faster responses

Fallback values in case of scraping failure

🧰 Error Handling

Graceful fallbacks for failed API calls

Detailed console logging for debugging

Database error recovery mechanisms

🔍 Web Scraping

Multiple selector strategies for robustness

Uses request headers to avoid blocking

Parallel scraping for performance

🚀 Deployment

This project can be easily deployed on:

Render

Railway

Heroku

Any Node.js hosting platform

Example Environment Variables
PORT=3000

📈 Business Logic Overview

Sources: Ambito, DolarHoy, Cronista

Data Processing: Real-time average computation

Slippage Analysis: Percentage deviation from average

Regional Focus: USD to ARS conversion

🔮 Future Enhancements

Add more currency sources (e.g., USD–BRL)

Implement historical data analytics

Add authentication and rate limiting

Build frontend dashboard

Add WebSocket support for live updates

👨‍💻 Developer

Built with ❤️ by Prashanth B.K.M

Ready for production deployment and integration! 🎯


---

### ✅ What to Do Next
1. Copy everything above.  
2. Create a new file in your project root:  
   **`README.md`**
3. Paste this content and save it.  
4. Commit and push to GitHub:
   ```bash
   git add README.md
   git commit -m "Added professional README"
   git push
