const express = require('express');
const cors = require('cors');
const DataService = require('./dataService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create data service instance
const dataService = new DataService();

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Currency API is working!',
        endpoints: {
            quotes: '/quotes',
            average: '/average', 
            slippage: '/slippage'
        }
    });
});

// 1.a Quotes endpoint - returns array of quotes
app.get('/quotes', async (req, res) => {
    try {
        const quotes = await dataService.getQuotes();
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

// 1.b Average endpoint - returns average prices
app.get('/average', async (req, res) => {
    try {
        const average = await dataService.getAverage();
        res.json(average);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate average' });
    }
});

// 1.c Slippage endpoint - returns slippage percentages
app.get('/slippage', async (req, res) => {
    try {
        const slippage = await dataService.getSlippage();
        res.json(slippage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate slippage' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Start updating data every 60 seconds
    setInterval(() => dataService.updateQuotes(), 60000);
    // Initial update
    dataService.updateQuotes();
});