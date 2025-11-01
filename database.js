const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in current directory
const dbPath = path.join(__dirname, 'currency.db');
console.log(`📁 Database path: ${dbPath}`);

// Create/connect to database file
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create table if it doesn't exist
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            buy_price REAL NOT NULL,
            sell_price REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err.message);
        } else {
            console.log('✅ Quotes table ready');
        }
    });
}

// Helper function to insert quotes - THIS WAS MISSING!
function insertQuote(quote) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO quotes (source, buy_price, sell_price) VALUES (?, ?, ?)',
            [quote.source, quote.buy_price, quote.sell_price],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            }
        );
    });
}

// Helper function to get latest quotes
function getLatestQuotes() {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT source, buy_price, sell_price, timestamp 
             FROM quotes 
             WHERE timestamp > datetime('now', '-5 minutes')
             ORDER BY timestamp DESC`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

// Export the database connection AND the helper functions
module.exports = db;
module.exports.insertQuote = insertQuote;
module.exports.getLatestQuotes = getLatestQuotes;