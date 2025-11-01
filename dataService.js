const db = require('./database');
const CurrencyScraper = require('./scraper');

class DataService {
    constructor() {
        this.scraper = new CurrencyScraper();
        this.cachedQuotes = [];
        this.lastUpdate = null;
        this.isUpdating = false;
    }

    async updateQuotes() {
        // Prevent multiple simultaneous updates
        if (this.isUpdating) {
            console.log('⏳ Update already in progress...');
            return;
        }

        this.isUpdating = true;
        
        try {
            console.log('🔄 Updating currency quotes...');
            const quotes = await this.scraper.getAllQuotes();
            
            // Store in database
            let savedCount = 0;
            for (const quote of quotes) {
                try {
                    await db.insertQuote(quote);
                    savedCount++;
                    console.log(`💾 Saved quote from: ${quote.source}`);
                } catch (dbError) {
                    console.error('❌ Database error for', quote.source, dbError.message);
                }
            }
            
            // Update cache
            this.cachedQuotes = quotes;
            this.lastUpdate = new Date();
            console.log(`✅ Quotes updated successfully. Saved ${savedCount}/${quotes.length} quotes to database.`);
            
        } catch (error) {
            console.error('❌ Error updating quotes:', error.message);
        } finally {
            this.isUpdating = false;
        }
    }

    async getQuotes() {
        // If no cached data or data is stale, update first
        if (this.cachedQuotes.length === 0 || !this.isDataFresh()) {
            console.log('🔄 Data is stale or empty, fetching fresh quotes...');
            await this.updateQuotes();
        }
        
        return this.cachedQuotes;
    }

    async getAverage() {
        const quotes = await this.getQuotes();
        
        if (quotes.length === 0) {
            return { 
                average_buy_price: 0, 
                average_sell_price: 0,
                message: "No data available"
            };
        }

        const totalBuy = quotes.reduce((sum, quote) => sum + quote.buy_price, 0);
        const totalSell = quotes.reduce((sum, quote) => sum + quote.sell_price, 0);

        const averageBuy = totalBuy / quotes.length;
        const averageSell = totalSell / quotes.length;

        return {
            average_buy_price: parseFloat(averageBuy.toFixed(4)),
            average_sell_price: parseFloat(averageSell.toFixed(4)),
            sources_count: quotes.length,
            timestamp: this.lastUpdate
        };
    }

    async getSlippage() {
        const quotes = await this.getQuotes();
        const average = await this.getAverage();
        
        if (quotes.length === 0) {
            return [];
        }

        const slippageData = quotes.map(quote => {
            const buySlippage = ((quote.buy_price - average.average_buy_price) / average.average_buy_price) * 100;
            const sellSlippage = ((quote.sell_price - average.average_sell_price) / average.average_sell_price) * 100;

            return {
                buy_price_slippage: parseFloat(buySlippage.toFixed(4)),
                sell_price_slippage: parseFloat(sellSlippage.toFixed(4)),
                source: quote.source,
                original_buy_price: quote.buy_price,
                original_sell_price: quote.sell_price
            };
        });

        return slippageData;
    }

    isDataFresh() {
        if (!this.lastUpdate) return false;
        const timeDiff = (new Date() - this.lastUpdate) / 1000; // in seconds
        return timeDiff < 60; // Fresh if less than 60 seconds
    }

    getStatus() {
        return {
            lastUpdate: this.lastUpdate,
            isDataFresh: this.isDataFresh(),
            cachedQuotesCount: this.cachedQuotes.length,
            isUpdating: this.isUpdating
        };
    }
}

module.exports = DataService;