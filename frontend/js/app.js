/* =====================================
   MARKETPULSE
   Main Application JavaScript
===================================== */


/* =====================================
   GLOBAL DATA
===================================== */

let cryptoData = [];

let stockData = [];

let marketChart = null;

let stocksExpanded = false;

let cryptoExpanded = false;


/* =====================================
   PAGE LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCrypto();

        loadStocks();

        renderWatchlist();

        updateLastUpdated();

        setInterval(
            refreshMarketData,
            60000
        );

    }
);


/* =====================================
   REFRESH DATA
===================================== */

function refreshMarketData() {

    loadCrypto();

    loadStocks();

    updateLastUpdated();

}


/* =====================================
   LOAD CRYPTO
===================================== */

async function loadCrypto() {

    const container =
        document.getElementById("crypto");

    try {

        const response =
            await fetch("/api/crypto");

        if (!response.ok) {

            throw new Error(
                "Crypto API error"
            );

        }

        cryptoData =
            await response.json();

        displayCrypto();

        updateDashboardSummary();

        loadMarketChart();

        loadTopMovers();

        loadMarketKPIs();

        renderWatchlist();

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="loading">
                Unable to load cryptocurrency data.
            </p>
        `;

    }

}


/* =====================================
   DISPLAY CRYPTO
===================================== */

function displayCrypto() {

    const container =
        document.getElementById("crypto");

    container.innerHTML = "";

    if (
        !Array.isArray(cryptoData)
        ||
        cryptoData.length === 0
    ) {

        container.innerHTML = `
            <p class="loading">
                No cryptocurrency data available.
            </p>
        `;

        return;
    }


    cryptoData.forEach(
        (coin, index) => {

            const change =
                Number(
                    coin.price_change_percentage_24h
                    || 0
                );

            const card =
                document.createElement("div");

            card.className =
                "market-card";

            if (index >= 3) {

                card.classList.add(
                    "hidden-card"
                );

            }


            card.onclick = function () {

                showAssetDetails(
                    coin,
                    "crypto"
                );

            };


            card.innerHTML = `

                <div class="card-top">

                    <div class="asset-name">

                        <h3>
                            ${escapeHTML(
                                coin.name
                            )}
                        </h3>

                        <p>
                            ${coin.symbol
                                .toUpperCase()}
                        </p>

                    </div>

                </div>


                <div class="asset-price">

                    $${formatNumber(
                        coin.current_price
                    )}

                </div>


                <div class="price-change
                    ${change >= 0
                        ? "positive"
                        : "negative"}">

                    ${change >= 0
                        ? "+"
                        : ""}${change.toFixed(2)}%

                </div>


                <div class="card-stats">

                    <div class="stat-box">

                        <span>
                            Market Cap
                        </span>

                        <strong>
                            ${formatMarketCap(
                                coin.market_cap
                            )}
                        </strong>

                    </div>


                    <div class="stat-box">

                        <span>
                            Rank
                        </span>

                        <strong>
                            #${coin.market_cap_rank || "-"}
                        </strong>

                    </div>

                </div>


                <button
                    class="watchlist-btn"
                    onclick="event.stopPropagation();
                    addToWatchlist(
                        '${escapeJS(
                            coin.id
                        )}',
                        'crypto'
                    )"
                >

                    ★ Add to Watchlist

                </button>

            `;


            container.appendChild(card);

        }
    );

}


/* =====================================
   LOAD STOCKS
===================================== */

async function loadStocks() {

    const container =
        document.getElementById("stocks");

    try {

        const response =
            await fetch("/api/stocks");

        if (!response.ok) {

            throw new Error(
                "Stock API error"
            );

        }

        stockData =
            await response.json();

        displayStocks();

        updateDashboardSummary();

        loadTopMovers();

        loadMarketKPIs();

        renderWatchlist();

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="loading">
                Unable to load stock data.
            </p>
        `;

    }

}


/* =====================================
   DISPLAY STOCKS
===================================== */

function displayStocks() {

    const container =
        document.getElementById("stocks");

    container.innerHTML = "";

    if (
        !Array.isArray(stockData)
        ||
        stockData.length === 0
    ) {

        container.innerHTML = `
            <p class="loading">
                No stock data available.
            </p>
        `;

        return;
    }


    stockData.forEach(
        (stock, index) => {

            const change =
                Number(
                    stock.change || 0
                );

            const card =
                document.createElement("div");

            card.className =
                "market-card";


            if (
                index >= 3
                &&
                !stocksExpanded
            ) {

                card.classList.add(
                    "hidden-card"
                );

            }


            card.onclick = function () {

                showAssetDetails(
                    stock,
                    "stock"
                );

            };


            card.innerHTML = `

                <div class="card-top">

                    <div class="asset-name">

                        <h3>
                            ${escapeHTML(
                                stock.name
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                stock.symbol
                            )}
                        </p>

                    </div>

                </div>


                <div class="asset-price">

                    ₹${formatNumber(
                        stock.price
                    )}

                </div>


                <div class="price-change
                    ${change >= 0
                        ? "positive"
                        : "negative"}">

                    ${change >= 0
                        ? "+"
                        : ""}${change.toFixed(2)}%

                </div>


                <div class="card-stats">

                    <div class="stat-box">

                        <span>
                            Day High
                        </span>

                        <strong>
                            ₹${formatNumber(
                                stock.high
                            )}
                        </strong>

                    </div>


                    <div class="stat-box">

                        <span>
                            Day Low
                        </span>

                        <strong>
                            ₹${formatNumber(
                                stock.low
                            )}
                        </strong>

                    </div>

                </div>


                <button
                    class="watchlist-btn"
                    onclick="event.stopPropagation();
                    addToWatchlist(
                        '${escapeJS(
                            stock.symbol
                        )}',
                        'stock'
                    )"
                >

                    ★ Add to Watchlist

                </button>

            `;


            container.appendChild(card);

        }
    );


    updateViewButtons();

}


/* =====================================
   SEARCH
===================================== */

function searchAsset() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const query =
        input.value
            .trim()
            .toLowerCase();


    if (!query) {

        alert(
            "Please enter a stock or cryptocurrency name."
        );

        return;

    }


    const allCards =
        document.querySelectorAll(
            ".market-card"
        );


    let found = false;


    allCards.forEach(
        card => {

            card.classList.remove(
                "selected"
            );

            const text =
                card.innerText
                    .toLowerCase();


            if (
                !found
                &&
                text.includes(query)
            ) {

                card.classList.add(
                    "selected"
                );

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                found = true;

            }

        }
    );


    if (!found) {

        alert(
            "Asset not found. Try another name or symbol."
        );

    }

}


document
    .getElementById("searchInput")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                searchAsset();

            }

        }
    );


/* =====================================
   ASSET DETAILS
===================================== */

function showAssetDetails(
    asset,
    type
) {

    const title =
        document.getElementById(
            "detailTitle"
        );

    const subtitle =
        document.getElementById(
            "detailSubtitle"
        );

    const price =
        document.getElementById(
            "detailPrice"
        );

    const change =
        document.getElementById(
            "detailChange"
        );

    const high =
        document.getElementById(
            "detailHigh"
        );

    const low =
        document.getElementById(
            "detailLow"
        );

    const analysis =
        document.getElementById(
            "detailAnalysis"
        );


    let currentPrice;

    let changeValue;

    let highValue;

    let lowValue;

    let name;

    let symbol;


    if (type === "crypto") {

        currentPrice =
            Number(
                asset.current_price || 0
            );

        changeValue =
            Number(
                asset.price_change_percentage_24h
                || 0
            );

        highValue =
            Number(
                asset.high_24h || 0
            );

        lowValue =
            Number(
                asset.low_24h || 0
            );

        name =
            asset.name;

        symbol =
            asset.symbol.toUpperCase();

        price.innerText =
            "$" +
            formatNumber(
                currentPrice
            );

        high.innerText =
            "$" +
            formatNumber(
                highValue
            );

        low.innerText =
            "$" +
            formatNumber(
                lowValue
            );

    }

    else {

        currentPrice =
            Number(
                asset.price || 0
            );

        changeValue =
            Number(
                asset.change || 0
            );

        highValue =
            Number(
                asset.high || 0
            );

        lowValue =
            Number(
                asset.low || 0
            );

        name =
            asset.name;

        symbol =
            asset.symbol;

        price.innerText =
            "₹" +
            formatNumber(
                currentPrice
            );

        high.innerText =
            "₹" +
            formatNumber(
                highValue
            );

        low.innerText =
            "₹" +
            formatNumber(
                lowValue
            );

    }


    title.innerText =
        name;


    subtitle.innerText =
        symbol +
        " • " +
        (
            type === "crypto"
                ? "Cryptocurrency"
                : "Indian Stock"
        );


    change.innerText =
        (
            changeValue >= 0
                ? "+"
                : ""
        ) +
        changeValue.toFixed(2) +
        "%";


    change.className =
        changeValue >= 0
            ? "positive"
            : "negative";


    let message;


    if (changeValue > 3) {

        message =
            `${name} is showing strong positive momentum today. ` +
            `The asset has gained ${changeValue.toFixed(2)}%. ` +
            `This indicates strong short-term buying activity, ` +
            `although investors should consider volatility and ` +
            `market conditions before making decisions.`;

    }

    else if (changeValue > 0) {

        message =
            `${name} is currently trading positively with a ` +
            `${changeValue.toFixed(2)}% gain. ` +
            `The short-term trend is positive, but further ` +
            `market confirmation is recommended.`;

    }

    else if (changeValue < -3) {

        message =
            `${name} is experiencing significant negative ` +
            `movement of ${changeValue.toFixed(2)}%. ` +
            `This suggests short-term selling pressure. ` +
            `Investors should evaluate risk and market conditions ` +
            `before making investment decisions.`;

    }

    else if (changeValue < 0) {

        message =
            `${name} is currently trading lower by ` +
            `${Math.abs(changeValue).toFixed(2)}%. ` +
            `The asset is showing mild short-term weakness.`;

    }

    else {

        message =
            `${name} is currently showing relatively stable ` +
            `price movement. Monitor future market activity ` +
            `for a clearer trend.`;

    }


    analysis.innerText =
        message;


    document
        .getElementById(
            "assetDetails"
        )
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =====================================
   WATCHLIST
===================================== */

function getWatchlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "marketPulseWatchlist"
            )
        ) || [];

    }

    catch {

        return [];

    }

}


function saveWatchlist(
    list
) {

    localStorage.setItem(
        "marketPulseWatchlist",
        JSON.stringify(list)
    );

}


function addToWatchlist(
    identifier,
    type
) {

    const list =
        getWatchlist();


    const exists =
        list.some(
            item =>
                item.identifier === identifier
                &&
                item.type === type
        );


    if (exists) {

        alert(
            "This asset is already in your watchlist."
        );

        return;

    }


    list.push({

        identifier:
            identifier,

        type:
            type

    });


    saveWatchlist(list);

    renderWatchlist();


    alert(
        "Added to your watchlist!"
    );

}


function removeFromWatchlist(
    identifier,
    type
) {

    let list =
        getWatchlist();


    list =
        list.filter(
            item =>
                !(
                    item.identifier === identifier
                    &&
                    item.type === type
                )
        );


    saveWatchlist(list);

    renderWatchlist();

}


function renderWatchlist() {

    const container =
        document.getElementById(
            "watchlistContainer"
        );


    if (!container) {
        return;
    }


    const list =
        getWatchlist();


    if (list.length === 0) {

        container.innerHTML = `
            <p class="empty-watchlist">
                Your watchlist is empty.
                Add assets using the
                "Add to Watchlist" button.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    list.forEach(
        item => {

            let asset = null;


            if (
                item.type === "crypto"
            ) {

                asset =
                    cryptoData.find(
                        coin =>
                            coin.id ===
                            item.identifier
                    );

            }

            else {

                asset =
                    stockData.find(
                        stock =>
                            stock.symbol ===
                            item.identifier
                    );

            }


            if (!asset) {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "watchlist-item";

                div.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            item.identifier
                        )}
                    </h3>

                    <p>
                        Waiting for market data...
                    </p>

                    <button
                        class="remove-watchlist"
                        onclick="removeFromWatchlist(
                            '${escapeJS(
                                item.identifier
                            )}',
                            '${escapeJS(
                                item.type
                            )}'
                        )"
                    >
                        Remove
                    </button>

                `;

                container.appendChild(div);

                return;

            }


            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "watchlist-item";


            let currentPrice;

            let change;

            let name;


            if (
                item.type === "crypto"
            ) {

                currentPrice =
                    "$" +
                    formatNumber(
                        asset.current_price
                    );

                change =
                    Number(
                        asset.price_change_percentage_24h
                        || 0
                    );

                name =
                    asset.name;

            }

            else {

                currentPrice =
                    "₹" +
                    formatNumber(
                        asset.price
                    );

                change =
                    Number(
                        asset.change || 0
                    );

                name =
                    asset.name;

            }


            div.innerHTML = `

                <h3>
                    ${escapeHTML(name)}
                </h3>

                <p>
                    ${currentPrice}
                </p>

                <strong
                    class="${
                        change >= 0
                            ? "positive"
                            : "negative"
                    }"
                >
                    ${
                        change >= 0
                            ? "+"
                            : ""
                    }${change.toFixed(2)}%
                </strong>

                <button
                    class="remove-watchlist"
                    onclick="removeFromWatchlist(
                        '${escapeJS(
                            item.identifier
                        )}',
                        '${escapeJS(
                            item.type
                        )}'
                    )"
                >
                    Remove
                </button>

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================
   DASHBOARD SUMMARY
===================================== */

function updateDashboardSummary() {

    if (
        !cryptoData.length
        &&
        !stockData.length
    ) {

        return;

    }


    const prices =
        cryptoData
            .map(
                coin =>
                    Number(
                        coin.current_price
                    )
            )
            .filter(
                Number.isFinite
            );


    if (prices.length > 0) {

        const average =
            prices.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / prices.length;


        document.getElementById(
            "averagePrice"
        ).innerText =
            "$" +
            formatNumber(
                average
            );

    }


    const totalMarketCap =
        cryptoData
            .reduce(
                (
                    total,
                    coin
                ) =>
                    total +
                    Number(
                        coin.market_cap || 0
                    ),
                0
            );


    document.getElementById(
        "totalMarketCap"
    ).innerText =
        formatMarketCap(
            totalMarketCap
        );


    const allMovers = [

        ...cryptoData.map(
            coin => ({

                name:
                    coin.name,

                change:
                    Number(
                        coin.price_change_percentage_24h
                        || 0
                    )

            })
        ),

        ...stockData.map(
            stock => ({

                name:
                    stock.name,

                change:
                    Number(
                        stock.change || 0
                    )

            })
        )

    ];


    if (allMovers.length > 0) {

        const best =
            [...allMovers]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.change -
                        a.change
                )[0];


        const worst =
            [...allMovers]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a.change -
                        b.change
                )[0];


        document.getElementById(
            "bestPerformer"
        ).innerText =
            best.name;


        document.getElementById(
            "worstPerformer"
        ).innerText =
            worst.name;

    }

}


/* =====================================
   MARKET CHART
===================================== */

function loadMarketChart() {

    const canvas =
        document.getElementById(
            "marketChart"
        );


    if (
        !canvas
        ||
        !cryptoData.length
    ) {

        return;

    }


    const labels =
        cryptoData
            .slice(0, 8)
            .map(
                coin =>
                    coin.symbol
                        .toUpperCase()
            );


    const changes =
        cryptoData
            .slice(0, 8)
            .map(
                coin =>
                    Number(
                        coin.price_change_percentage_24h
                        || 0
                    )
            );


    if (marketChart) {

        marketChart.destroy();

    }


    marketChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [{

                        label:
                            "24h Change (%)",

                        data:
                            changes,

                        borderWidth: 1

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text:
                                    "Percentage Change (%)"

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================
   TOP MOVERS
===================================== */

function loadTopMovers() {

    const allAssets = [

        ...cryptoData.map(
            coin => ({

                name:
                    coin.name,

                symbol:
                    coin.symbol
                        .toUpperCase(),

                price:
                    Number(
                        coin.current_price
                        || 0
                    ),

                change:
                    Number(
                        coin.price_change_percentage_24h
                        || 0
                    ),

                currency:
                    "$"

            })
        ),

        ...stockData.map(
            stock => ({

                name:
                    stock.name,

                symbol:
                    stock.symbol,

                price:
                    Number(
                        stock.price
                        || 0
                    ),

                change:
                    Number(
                        stock.change
                        || 0
                    ),

                currency:
                    "₹"

            })
        )

    ];


    const sorted =
        [...allAssets]
            .sort(
                (
                    a,
                    b
                ) =>
                    b.change -
                    a.change
            );


    const gainers =
        sorted
            .filter(
                item =>
                    item.change > 0
            )
            .slice(0, 5);


    const losers =
        [...sorted]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.change -
                    b.change
            )
            .filter(
                item =>
                    item.change < 0
            )
            .slice(0, 5);


    displayMovers(
        gainers,
        "topGainers"
    );


    displayMovers(
        losers,
        "topLosers"
    );

}


/* =====================================
   DISPLAY MOVERS
===================================== */

function displayMovers(
    data,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!data.length) {

        container.innerHTML = `
            <p>
                No data available.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "movement-item";


            div.innerHTML = `

                <div class="movement-info">

                    <h4>
                        ${escapeHTML(
                            item.name
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            item.symbol
                        )}
                    </p>

                </div>


                <div class="movement-data">

                    <span
                        class="movement-price"
                    >
                        ${item.currency}${formatNumber(
                            item.price
                        )}
                    </span>

                    <span
                        class="${
                            item.change >= 0
                                ? "positive"
                                : "negative"
                        }"
                    >
                        ${
                            item.change >= 0
                                ? "+"
                                : ""
                        }${item.change.toFixed(2)}%
                    </span>

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* =====================================
   MARKET KPI
===================================== */

function loadMarketKPIs() {

    updateDashboardSummary();

}


/* =====================================
   MARKET FILTER
===================================== */

function filterMarket(
    type,
    clickedButton
) {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(
        button =>
            button.classList.remove(
                "active"
            )
    );


    clickedButton.classList.add(
        "active"
    );


    const stockSection =
        document.getElementById(
            "stocks-section"
        );


    const cryptoSection =
        document.getElementById(
            "crypto-section"
        );


    if (type === "stocks") {

        stockSection.style.display =
            "block";

        cryptoSection.style.display =
            "none";

    }

    else if (
        type === "crypto"
    ) {

        stockSection.style.display =
            "none";

        cryptoSection.style.display =
            "block";

    }

    else {

        stockSection.style.display =
            "block";

        cryptoSection.style.display =
            "block";

    }

}


/* =====================================
   VIEW ALL STOCKS
===================================== */

function toggleStocks() {

    stocksExpanded =
        !stocksExpanded;


    const cards =
        document.querySelectorAll(
            "#stocks .market-card"
        );


    cards.forEach(
        (
            card,
            index
        ) => {

            if (index >= 3) {

                card.classList.toggle(
                    "hidden-card",
                    !stocksExpanded
                );

            }

        }
    );


    updateViewButtons();

}


/* =====================================
   VIEW ALL CRYPTO
===================================== */

function toggleCrypto() {

    cryptoExpanded =
        !cryptoExpanded;


    const cards =
        document.querySelectorAll(
            "#crypto .market-card"
        );


    cards.forEach(
        (
            card,
            index
        ) => {

            if (index >= 3) {

                card.classList.toggle(
                    "hidden-card",
                    !cryptoExpanded
                );

            }

        }
    );


    updateViewButtons();

}


/* =====================================
   UPDATE VIEW BUTTONS
===================================== */

function updateViewButtons() {

    const stockButton =
        document.getElementById(
            "stocksViewButton"
        );


    const cryptoButton =
        document.getElementById(
            "cryptoViewButton"
        );


    if (stockButton) {

        stockButton.innerText =
            stocksExpanded
                ? "Show Less"
                : "View All Stocks";

    }


    if (cryptoButton) {

        cryptoButton.innerText =
            cryptoExpanded
                ? "Show Less"
                : "View All Crypto";

    }

}


/* =====================================
   LAST UPDATED
===================================== */

function updateLastUpdated() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) {
        return;
    }


    const now =
        new Date();


    element.innerText =
        "Last updated: " +
        now.toLocaleTimeString();

}


/* =====================================
   NUMBER FORMAT
===================================== */

function formatNumber(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return "0.00";

    }


    return number.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* =====================================
   MARKET CAP FORMAT
===================================== */

function formatMarketCap(
    value
) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "$0";

    }


    if (
        number >=
        1_000_000_000_000
    ) {

        return "$" +
            (
                number /
                1_000_000_000_000
            ).toFixed(2) +
            "T";

    }


    if (
        number >=
        1_000_000_000
    ) {

        return "$" +
            (
                number /
                1_000_000_000
            ).toFixed(2) +
            "B";

    }


    if (
        number >=
        1_000_000
    ) {

        return "$" +
            (
                number /
                1_000_000
            ).toFixed(2) +
            "M";

    }


    return "$" +
        formatNumber(number);

}


/* =====================================
   SECURITY HELPERS
===================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeJS(
    value
) {

    return String(value)
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        );

}