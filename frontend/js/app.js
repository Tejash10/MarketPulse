// ==========================================
// MARKETPULSE - JAVASCRIPT
// ==========================================


// ==========================================
// CRYPTOCURRENCY
// ==========================================

async function loadCrypto() {

    try {

        const response =
            await fetch("/api/crypto");

        if (!response.ok) {

            throw new Error(
                "Crypto API request failed"
            );

        }

        const data =
            await response.json();

        console.log(
            "Crypto data:",
            data
        );

        displayCrypto(data);

    } catch (error) {

        console.error(
            "Crypto API error:",
            error
        );

        const cryptoContainer =
            document.getElementById("crypto");

        if (cryptoContainer) {

            cryptoContainer.innerHTML =
                "<p>Unable to load cryptocurrency data.</p>";

        }

    }

}


// ==========================================
// DISPLAY CRYPTO
// ==========================================

function displayCrypto(coins) {

    const cryptoContainer =
        document.getElementById("crypto");

    if (!cryptoContainer) {
        return;
    }

    cryptoContainer.innerHTML = "";

    coins.forEach(coin => {

        // Show only first 3 cryptocurrencies initially

const cryptoCards =
    document.querySelectorAll(
        "#crypto .market-card"
    );

cryptoCards.forEach(
    (card, index) => {

        if (index >= 3) {
            card.style.display = "none";
        }

    }
);

        const card =
            document.createElement("div");

        card.className =
            "market-card";

        const change =
            coin.price_change_percentage_24h || 0;

        const changeClass =
            change >= 0
                ? "positive"
                : "negative";

        const changeSymbol =
            change >= 0
                ? "+"
                : "";

        const symbol =
            coin.symbol.toUpperCase();

        card.innerHTML = `

            <div class="asset-header">

                <div>

                    <h3>
                        ${coin.name}
                    </h3>

                    <span>
                        ${symbol}
                    </span>

                </div>

                <span class="${changeClass}">
                    ${changeSymbol}${change.toFixed(2)}%
                </span>

            </div>


            <div class="price">

                $${Number(
                    coin.current_price
                ).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}

            </div>


            <div class="asset-info">

                <span>

                    Market Cap:
                    $${Number(
                        coin.market_cap
                    ).toLocaleString("en-US")}

                </span>

                <span>

                    Volume:
                    $${Number(
                        coin.total_volume
                    ).toLocaleString("en-US")}

                </span>

            </div>


            <button
                class="watchlist-btn"
                onclick="addToWatchlist(
                    '${symbol}',
                    '${coin.name}',
                    'Cryptocurrency'
                )">

                ⭐ Add to Watchlist

            </button>

        `;

        cryptoContainer.appendChild(card);

    });

}


// ==========================================
// LOAD CRYPTO DATA
// ==========================================

loadCrypto();


// ==========================================
// STOCK MARKET
// ==========================================

async function loadStocks() {

    try {

        const response =
            await fetch("/api/stocks");

        if (!response.ok) {

            throw new Error(
                "Stock API request failed"
            );

        }

        const stocks =
            await response.json();

        console.log(
            "Stock data:",
            stocks
        );

        displayStocks(stocks);

    } catch (error) {

        console.error(
            "Stock error:",
            error
        );

        const stockContainer =
            document.getElementById("stocks");

        if (stockContainer) {

            stockContainer.innerHTML =
                "<p>Unable to load stock data.</p>";

        }

    }

}


// ==========================================
// DISPLAY STOCKS
// ==========================================

function displayStocks(stocks) {

    const stockContainer =
        document.getElementById("stocks");

    if (!stockContainer) {
        return;
    }

    stockContainer.innerHTML = "";

    stocks.forEach(stock => {

        const card =
            document.createElement("div");

        card.className =
            "market-card";

        const changeClass =
            stock.change >= 0
                ? "positive"
                : "negative";

        const changeSymbol =
            stock.change >= 0
                ? "+"
                : "";

        card.innerHTML = `

            <div class="asset-header">

                <div>

                    <h3>
                        ${stock.symbol}
                    </h3>

                    <span>
                        ${stock.name}
                    </span>

                </div>

                <span class="${changeClass}">

                    ${changeSymbol}${stock.change.toFixed(2)}%

                </span>

            </div>


            <div class="price">

                ₹${stock.price.toLocaleString("en-IN")}

            </div>


            <div class="asset-info">

                <span>

                    High:
                    ₹${stock.high.toLocaleString("en-IN")}

                </span>

                <span>

                    Low:
                    ₹${stock.low.toLocaleString("en-IN")}

                </span>

            </div>


            <button
                class="watchlist-btn"
                onclick="addToWatchlist(
                    '${stock.symbol}',
                    '${stock.name}',
                    'Stock'
                )">

                ⭐ Add to Watchlist

            </button>

        `;

        stockContainer.appendChild(card);

    });

}


// ==========================================
// LOAD STOCK DATA
// ==========================================

loadStocks();


// ==========================================
// SEARCH ASSETS
// ==========================================

function searchAsset() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    if (searchTerm === "") {

        alert(
            "Please enter a stock or cryptocurrency name."
        );

        return;
    }


    // ======================================
    // SEARCH STOCKS
    // ======================================

    const stockCards =
        document.querySelectorAll(
            "#stocks .market-card"
        );


    // ======================================
    // SEARCH CRYPTO
    // ======================================

    const cryptoCards =
        document.querySelectorAll(
            "#crypto .market-card"
        );

    let found = false;


    // ======================================
    // CHECK STOCK CARDS
    // ======================================

    stockCards.forEach(card => {

        const cardText =
            card.innerText.toLowerCase();

        if (
            cardText.includes(searchTerm)
        ) {

            card.style.display =
                "block";

            card.style.border =
                "3px solid #2563eb";

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            found = true;

        } else {

            card.style.border = "";

        }

    });


    // ======================================
    // CHECK CRYPTO CARDS
    // ======================================

    cryptoCards.forEach(card => {

        const cardText =
            card.innerText.toLowerCase();

        if (
            cardText.includes(searchTerm)
        ) {

            card.style.display =
                "block";

            card.style.border =
                "3px solid #2563eb";

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            found = true;

        } else {

            card.style.border = "";

        }

    });


    // ======================================
    // NO RESULT
    // ======================================

    if (!found) {

        alert(
            `No market asset found for "${searchInput.value}".`
        );

    }

}


// ==========================================
// SEARCH WITH ENTER KEY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        searchAsset();

                    }

                }
            );

        }

    }
);


// ==========================================
// WATCHLIST SYSTEM
// ==========================================

let watchlist =
    JSON.parse(
        localStorage.getItem(
            "marketPulseWatchlist"
        )
    ) || [];


// ==========================================
// SAVE WATCHLIST
// ==========================================

function saveWatchlist() {

    localStorage.setItem(
        "marketPulseWatchlist",
        JSON.stringify(watchlist)
    );

}


// ==========================================
// ADD ASSET TO WATCHLIST
// ==========================================

function addToWatchlist(
    symbol,
    name,
    type
) {

    const alreadyExists =
        watchlist.some(
            asset =>
                asset.symbol === symbol
        );

    if (alreadyExists) {

        alert(
            symbol +
            " is already in your watchlist."
        );

        return;
    }

    watchlist.push({

        symbol: symbol,

        name: name,

        type: type

    });

    saveWatchlist();

    renderWatchlist();

    alert(
        symbol +
        " added to your watchlist!"
    );

}


// ==========================================
// REMOVE ASSET FROM WATCHLIST
// ==========================================

function removeFromWatchlist(symbol) {

    watchlist =
        watchlist.filter(
            asset =>
                asset.symbol !== symbol
        );

    saveWatchlist();

    renderWatchlist();

}


// ==========================================
// DISPLAY WATCHLIST
// ==========================================

async function renderWatchlist() {

    const watchlistContainer =
        document.getElementById(
            "watchlist"
        );

    if (!watchlistContainer) {
        return;
    }


    if (watchlist.length === 0) {

        watchlistContainer.innerHTML = `

            <div class="section-header">

                <div>

                    <h2>
                        ⭐ My Watchlist
                    </h2>

                    <p>
                        Assets you want to monitor
                    </p>

                </div>

            </div>

            <div class="empty-watchlist">

                <div class="watch-icon">
                    ⭐
                </div>

                <h3>
                    Your watchlist is empty
                </h3>

                <p>
                    Add a stock or cryptocurrency
                    using the Watchlist button.
                </p>

            </div>

        `;

        return;
    }


    watchlistContainer.innerHTML = `

        <div class="section-header">

            <div>

                <h2>
                    ⭐ My Watchlist
                </h2>

                <p>
                    Assets you want to monitor
                </p>

            </div>

        </div>

        <p class="watchlist-empty">
            Loading watchlist data...
        </p>

    `;


    let stocks = [];

    let crypto = [];


    // ======================================
    // GET STOCK DATA
    // ======================================

    try {

        const stockResponse =
            await fetch("/api/stocks");

        if (stockResponse.ok) {

            stocks =
                await stockResponse.json();

        }

    } catch (error) {

        console.error(
            "Watchlist stock error:",
            error
        );

    }


    // ======================================
    // GET CRYPTO DATA
    // ======================================

    try {

        const cryptoResponse =
            await fetch("/api/crypto");

        if (cryptoResponse.ok) {

            crypto =
                await cryptoResponse.json();

        }

    } catch (error) {

        console.error(
            "Watchlist crypto error:",
            error
        );

    }


    watchlistContainer.innerHTML = `

        <div class="section-header">

            <div>

                <h2>
                    ⭐ My Watchlist
                </h2>

                <p>
                    Assets you want to monitor
                </p>

            </div>

        </div>

    `;


    const watchlistGrid =
        document.createElement("div");

    watchlistGrid.className =
        "watchlist-grid";


    // ======================================
    // CREATE WATCHLIST CARDS
    // ======================================

    watchlist.forEach(asset => {

        let price = null;

        let change = null;


        // ==================================
        // STOCK DATA
        // ==================================

        if (asset.type === "Stock") {

            const stock =
                stocks.find(
                    item =>
                        item.symbol ===
                        asset.symbol
                );

            if (stock) {

                price =
                    `₹${Number(
                        stock.price
                    ).toLocaleString(
                        "en-IN"
                    )}`;

                change =
                    stock.change;

            }

        }


        // ==================================
        // CRYPTO DATA
        // ==================================

        if (
            asset.type ===
            "Cryptocurrency"
        ) {

            const coin =
                crypto.find(
                    item =>
                        item.symbol.toUpperCase() ===
                        asset.symbol
                );

            if (coin) {

                price =
                    `$${Number(
                        coin.current_price
                    ).toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}`;

                change =
                    coin.price_change_percentage_24h ||
                    0;

            }

        }


        // ==================================
        // CHANGE DISPLAY
        // ==================================

        let changeHTML =
            `<span>Data unavailable</span>`;


        if (change !== null) {

            const changeClass =
                change >= 0
                    ? "positive"
                    : "negative";

            const changeSymbol =
                change >= 0
                    ? "+"
                    : "";

            changeHTML = `

                <span class="${changeClass}">

                    ${changeSymbol}${Number(
                        change
                    ).toFixed(2)}%

                </span>

            `;

        }


        // ==================================
        // CREATE CARD
        // ==================================

        const card =
            document.createElement("div");

        card.className =
            "watchlist-card";


        card.innerHTML = `

            <div class="watchlist-info">

                <h3>
                    ${asset.symbol}
                </h3>

                <p>
                    ${asset.name}
                </p>

                <small>
                    ${asset.type}
                </small>

            </div>


            <div class="watchlist-market">

                <strong>
                    ${price || "Data unavailable"}
                </strong>

                ${changeHTML}

            </div>


            <div class="watchlist-actions">

                <button
                    onclick="removeFromWatchlist('${asset.symbol}')"
                    class="remove-watchlist">

                    Remove

                </button>

            </div>

        `;


        watchlistGrid.appendChild(card);

    });


    watchlistContainer.appendChild(
        watchlistGrid
    );

}


// ==========================================
// INITIALIZE WATCHLIST
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderWatchlist();

    }
);


// ==========================================
// AUTOMATIC MARKET DATA REFRESH
// ==========================================

setInterval(
    function () {

        console.log(
            "Refreshing MarketPulse data..."
        );

        location.reload();

    },
    60000
);


// ==========================================
// DASHBOARD KPI SUMMARY
// ==========================================

async function updateDashboardSummary() {

    try {

        const stockResponse =
            await fetch("/api/stocks");

        const stocks =
            await stockResponse.json();


        const cryptoResponse =
            await fetch("/api/crypto");

        const crypto =
            await cryptoResponse.json();


        const assets = [];


        // ======================================
        // ADD STOCKS
        // ======================================

        stocks.forEach(stock => {

            assets.push({

                symbol:
                    stock.symbol,

                name:
                    stock.name,

                change:
                    Number(
                        stock.change
                    ),

                type:
                    "Stock"

            });

        });


        // ======================================
        // ADD CRYPTO
        // ======================================

        crypto.forEach(coin => {

            assets.push({

                symbol:
                    coin.symbol.toUpperCase(),

                name:
                    coin.name,

                change:
                    Number(
                        coin.price_change_percentage_24h ||
                        0
                    ),

                type:
                    "Cryptocurrency"

            });

        });


        // ======================================
        // TOTAL ASSETS
        // ======================================

        const totalAssets =
            document.getElementById(
                "totalAssets"
            );

        if (totalAssets) {

            totalAssets.textContent =
                assets.length;

        }


        // ======================================
        // TOP GAINER
        // ======================================

        const topGainer =
            document.getElementById(
                "topGainer"
            );

        if (
            topGainer &&
            assets.length > 0
        ) {

            const gainer =
                [...assets].sort(
                    (a, b) =>
                        b.change -
                        a.change
                )[0];

            topGainer.textContent =
                `${gainer.symbol} +${gainer.change.toFixed(2)}%`;

        }


        // ======================================
        // TOP LOSER
        // ======================================

        const topLoser =
            document.getElementById(
                "topLoser"
            );

        if (
            topLoser &&
            assets.length > 0
        ) {

            const loser =
                [...assets].sort(
                    (a, b) =>
                        a.change -
                        b.change
                )[0];

            topLoser.textContent =
                `${loser.symbol} ${loser.change.toFixed(2)}%`;

        }


        // ======================================
        // WATCHLIST COUNT
        // ======================================

        const watchlistCount =
            document.getElementById(
                "watchlistCount"
            );

        if (watchlistCount) {

            watchlistCount.textContent =
                watchlist.length;

        }


        console.log(
            "Dashboard summary updated."
        );


    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

    }

}


// ==========================================
// MARKET PERFORMANCE CHART
// ==========================================

async function loadMarketChart() {

    try {

        const response =
            await fetch("/api/crypto");

        if (!response.ok) {

            throw new Error(
                "Crypto API request failed"
            );

        }

        const crypto =
            await response.json();

        const chartCanvas =
            document.getElementById(
                "marketChart"
            );

        if (!chartCanvas) {
            return;
        }


        const labels =
            crypto.map(
                coin =>
                    coin.name
            );


        const prices =
            crypto.map(
                coin =>
                    coin.current_price
            );


        new Chart(
            chartCanvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Current Price (USD)",

                            data:
                                prices,

                            borderWidth: 1

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                true

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                false,

                            ticks: {

                                callback:
                                    function(value) {

                                        return "$" +
                                            Number(
                                                value
                                            ).toLocaleString();

                                    }

                            }

                        }

                    }

                }

            }
        );


    } catch (error) {

        console.error(
            "Chart error:",
            error
        );

    }

}


// ==========================================
// LOAD MARKET CHART
// ==========================================

loadMarketChart();


// ==========================================
// TOP GAINERS & LOSERS
// ==========================================

async function loadTopMovers() {

    try {

        const response =
            await fetch("/api/crypto");

        if (!response.ok) {

            throw new Error(
                "Crypto API request failed"
            );

        }

        const crypto =
            await response.json();


        // Sort highest to lowest

        const sortedCrypto =
            [...crypto].sort(
                (a, b) =>
                    (b.price_change_percentage_24h || 0) -
                    (a.price_change_percentage_24h || 0)
            );


        // Top 3 gainers

        const gainers =
            sortedCrypto
                .filter(
                    coin =>
                        (coin.price_change_percentage_24h || 0) > 0
                )
                .slice(0, 3);


        // Top 3 losers

        const losers =
            [...sortedCrypto]
                .filter(
                    coin =>
                        (coin.price_change_percentage_24h || 0) < 0
                )
                .sort(
                    (a, b) =>
                        (a.price_change_percentage_24h || 0) -
                        (b.price_change_percentage_24h || 0)
                )
                .slice(0, 3);


        displayMovers(
            "topGainers",
            gainers
        );

        displayMovers(
            "topLosers",
            losers
        );


    } catch (error) {

        console.error(
            "Top movers error:",
            error
        );

    }

}


function displayMovers(
    containerId,
    coins
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) {
        return;
    }


    if (coins.length === 0) {

        container.innerHTML =
            "<p>No market movement data available.</p>";

        return;
    }


    container.innerHTML = "";


    coins.forEach(coin => {

        const change =
            coin.price_change_percentage_24h ||
            0;


        const changeClass =
            change >= 0
                ? "positive"
                : "negative";


        const changeSymbol =
            change >= 0
                ? "+"
                : "";


        const price =
            Number(
                coin.current_price
            ).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        const item =
            document.createElement("div");


        item.className =
            "movement-item";


        item.innerHTML = `

            <div class="movement-info">

                <h4>
                    ${coin.name}
                </h4>

                <p>
                    ${coin.symbol.toUpperCase()}
                </p>

            </div>


            <div class="movement-data">

                <span class="movement-price">

                    $${price}

                </span>

                <span class="${changeClass}">

                    ${changeSymbol}${Number(
                        change
                    ).toFixed(2)}%

                </span>

            </div>

        `;


        container.appendChild(item);

    });

}


loadTopMovers();


// ==========================================
// MARKET KPI SUMMARY
// ==========================================

async function loadMarketKPIs() {

    try {

        const response =
            await fetch("/api/crypto");

        if (!response.ok) {

            throw new Error(
                "Crypto API request failed"
            );

        }

        const crypto =
            await response.json();


        if (
            !crypto ||
            crypto.length === 0
        ) {

            return;

        }


        // ======================================
        // TOTAL MARKET CAP
        // ======================================

        const totalMarketCap =
            crypto.reduce(
                (total, coin) =>
                    total +
                    (coin.market_cap || 0),
                0
            );


        // ======================================
        // AVERAGE PRICE
        // ======================================

        const averagePrice =
            crypto.reduce(
                (total, coin) =>
                    total +
                    (coin.current_price || 0),
                0
            ) / crypto.length;


        // ======================================
        // BEST PERFORMER
        // ======================================

        const bestPerformer =
            [...crypto].sort(
                (a, b) =>
                    (b.price_change_percentage_24h || 0) -
                    (a.price_change_percentage_24h || 0)
            )[0];


        // ======================================
        // WORST PERFORMER
        // ======================================

        const worstPerformer =
            [...crypto].sort(
                (a, b) =>
                    (a.price_change_percentage_24h || 0) -
                    (b.price_change_percentage_24h || 0)
            )[0];


        // ======================================
        // DISPLAY TOTAL MARKET CAP
        // ======================================

        const totalMarketCapElement =
            document.getElementById(
                "totalMarketCap"
            );

        if (totalMarketCapElement) {

            totalMarketCapElement.textContent =
                "$" +
                totalMarketCap.toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits: 0
                    }
                );

        }


        // ======================================
        // DISPLAY AVERAGE PRICE
        // ======================================

        const averagePriceElement =
            document.getElementById(
                "averagePrice"
            );

        if (averagePriceElement) {

            averagePriceElement.textContent =
                "$" +
                averagePrice.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );

        }


        // ======================================
        // DISPLAY BEST PERFORMER
        // ======================================

        const bestPerformerElement =
            document.getElementById(
                "bestPerformer"
            );

        if (
            bestPerformerElement &&
            bestPerformer
        ) {

            const bestChange =
                Number(
                    bestPerformer.price_change_percentage_24h ||
                    0
                );

            bestPerformerElement.innerHTML = `

                ${bestPerformer.name}

                <span class="positive">

                    +${bestChange.toFixed(2)}%

                </span>

            `;

        }


        // ======================================
        // DISPLAY WORST PERFORMER
        // ======================================

        const worstPerformerElement =
            document.getElementById(
                "worstPerformer"
            );

        if (
            worstPerformerElement &&
            worstPerformer
        ) {

            const worstChange =
                Number(
                    worstPerformer.price_change_percentage_24h ||
                    0
                );

            worstPerformerElement.innerHTML = `

                ${worstPerformer.name}

                <span class="negative">

                    ${worstChange.toFixed(2)}%

                </span>

            `;

        }


        console.log(
            "Market KPI summary updated."
        );


    } catch (error) {

        console.error(
            "Market KPI error:",
            error
        );

    }

}


// ==========================================
// LOAD MARKET KPIs
// ==========================================

loadMarketKPIs();
// ==========================================
// MARKET FILTER
// ==========================================

function filterMarket(type, clickedButton) {

    const stockSection =
        document.getElementById("stocks-section");

    const cryptoSection =
        document.getElementById("crypto-section");

    if (!stockSection || !cryptoSection) {
        return;
    }


    // ======================================
    // SHOW ALL
    // ======================================

    if (type === "all") {

        stockSection.style.display = "block";
        cryptoSection.style.display = "block";

    }


    // ======================================
    // SHOW STOCKS ONLY
    // ======================================

    else if (type === "stocks") {

        stockSection.style.display = "block";
        cryptoSection.style.display = "none";

        stockSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ======================================
    // SHOW CRYPTO ONLY
    // ======================================

    else if (type === "crypto") {

        stockSection.style.display = "none";
        cryptoSection.style.display = "block";

        cryptoSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ======================================
    // UPDATE ACTIVE BUTTON
    // ======================================

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );

    buttons.forEach(button => {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    }

}
// ==========================================
// LAST UPDATED TIME
// ==========================================

function updateLastUpdatedTime() {

    const lastUpdated =
        document.getElementById("lastUpdated");

    if (!lastUpdated) {
        return;
    }

    const now = new Date();

    const formattedTime =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    const formattedDate =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    lastUpdated.textContent =
        `${formattedDate}, ${formattedTime}`;
}


// Run when page loads

document.addEventListener(
    "DOMContentLoaded",
    updateLastUpdatedTime
);
// ==========================================
// VIEW ALL / SHOW LESS
// ==========================================

let stocksExpanded = false;
let cryptoExpanded = false;


// ==========================================
// TOGGLE STOCKS
// ==========================================

function toggleStocks() {

    const stockCards =
        document.querySelectorAll(
            "#stocks .market-card"
        );

    const button =
        document.getElementById(
            "stocksViewButton"
        );

    if (!button) {
        return;
    }


    stocksExpanded =
        !stocksExpanded;


    stockCards.forEach(
        (card, index) => {

            if (stocksExpanded) {

                card.style.display = "block";

            } else {

                card.style.display =
                    index < 3
                        ? "block"
                        : "none";

            }

        }
    );


    button.textContent =
        stocksExpanded
            ? "Show Less"
            : "View All";

}


// ==========================================
// TOGGLE CRYPTO
// ==========================================

function toggleCrypto() {

    const cryptoCards =
        document.querySelectorAll(
            "#crypto .market-card"
        );

    const button =
        document.getElementById(
            "cryptoViewButton"
        );

    if (!button) {
        return;
    }


    cryptoExpanded =
        !cryptoExpanded;


    cryptoCards.forEach(
        (card, index) => {

            if (cryptoExpanded) {

                card.style.display = "block";

            } else {

                card.style.display =
                    index < 3
                        ? "block"
                        : "none";

            }

        }
    );


    button.textContent =
        cryptoExpanded
            ? "Show Less"
            : "View All";

}