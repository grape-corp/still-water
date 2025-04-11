const mockApiUrl = 'https://api.example.com/v1/market/data/'; // Replace with actual API in production
let cards = [];
const maxCards = window.innerWidth >= 768 ? 19 : 9; // 5x4 - 1 for desktop, 2x5 - 1 for mobile
        
// Sample default tickers
const defaultTickers = ['BTC-USD', 'ETH-USD', 'SPY'];
        
// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Add default cards
    defaultTickers.forEach(ticker => addCard(ticker));
            
    // Add event listener for the add card button
    document.getElementById('add-card').addEventListener('click', showAddForm);
            
    // Start data update interval
    setInterval(updateAllCardsData, 1000);
});
        
// Show form to add a new ticker
function showAddForm() {
    const addCardElement = document.getElementById('add-card');
            
    // Create form elements
    const form = document.createElement('div');
    form.className = 'add-form';
            
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter ticker (e.g., BTC-USD, AAPL)';
    input.required = true;
            
    const button = document.createElement('button');
    button.textContent = 'Add';
            
    form.appendChild(input);
    form.appendChild(button);
            
    // Clear the add card element and add the form
    addCardElement.innerHTML = '';
    addCardElement.appendChild(form);
            
    // Focus on the input
    input.focus();
            
    // Add event listener for the form button
    button.addEventListener('click', () => {
        const ticker = input.value.trim().toUpperCase();
        if (ticker) {
            addCard(ticker);
            resetAddCard();
        }
    });
            
    // Add event listener for Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ticker = input.value.trim().toUpperCase();
            if (ticker) {
                addCard(ticker);
                resetAddCard();
            }
        }
    });
}
        
// Reset the add card button after adding a ticker
function resetAddCard() {
    const addCardElement = document.getElementById('add-card');
    addCardElement.innerHTML = '<div class="add-icon">+</div>';
            
    // Hide add card if max cards reached
    if (cards.length >= maxCards) {
        addCardElement.style.display = 'none';
    }
}
        
// Add a new card for a ticker
function addCard(ticker) {
    if (cards.length >= maxCards) {
        alert('Maximum number of cards reached!');
        return;
    }
            
    // Check if ticker already exists
    if (cards.some(card => card.ticker === ticker)) {
        alert(`${ticker} is already being tracked!`);
        return;
    }
            
    // Create a new card element
    const cardElement = document.createElement('div');
    cardElement.className = 'card loading';
    cardElement.id = `card-${ticker}`;
            
    // Create card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
            
    const tickerElement = document.createElement('div');
    tickerElement.className = 'ticker';
    tickerElement.textContent = ticker;
            
    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => removeCard(ticker));
            
    cardHeader.appendChild(tickerElement);
    cardHeader.appendChild(closeButton);
            
    // Create price element
    const priceElement = document.createElement('div');
    priceElement.className = 'price';
    priceElement.textContent = 'Loading...';
            
    // Create metrics container
    const metricsElement = document.createElement('div');
    metricsElement.className = 'metrics';
            
    // Add RSI metrics
    const rsiGroup = createMetricGroup('RSI', [
        { label: '1m', value: '–' },
        { label: '5m', value: '–' },
        { label: '15m', value: '–' },
        { label: '1h', value: '–' },
        { label: '4h', value: '–' },
        { label: '1d', value: '–' }
    ]);
            
            // Add MACD metrics
            const macdGroup = createMetricGroup('MACD', [
                { label: '1m', value: '–' },
                { label: '5m', value: '–' },
                { label: '15m', value: '–' },
                { label: '1h', value: '–' },
                { label: '4h', value: '–' },
                { label: '1d', value: '–' }
            ]);
            
            // Add High/Low metrics
            const highLowGroup = createMetricGroup('High/Low', [
                { label: '1d', value: '–' },
                { label: '1w', value: '–' },
                { label: '1m', value: '–' },
                { label: '6m', value: '–' }
            ]);
            
            metricsElement.appendChild(rsiGroup);
            metricsElement.appendChild(macdGroup);
            metricsElement.appendChild(highLowGroup);
            
            // Add all elements to the card
            cardElement.appendChild(cardHeader);
            cardElement.appendChild(priceElement);
            cardElement.appendChild(metricsElement);
            
            // Add the card to the grid before the add button
            const addCardElement = document.getElementById('add-card');
            document.getElementById('card-grid').insertBefore(cardElement, addCardElement);
            
            // Add card to the cards array
            cards.push({
                ticker: ticker,
                element: cardElement,
                price: priceElement,
                metrics: {
                    rsi: rsiGroup,
                    macd: macdGroup,
                    highLow: highLowGroup
                }
            });
            
            // Fetch initial data
            fetchCardData(ticker);
        }
        
        // Create a metric group element
        function createMetricGroup(title, metrics) {
            const group = document.createElement('div');
            group.className = 'metric-group';
            
            const titleElement = document.createElement('div');
            titleElement.className = 'metric-title';
            titleElement.textContent = title;
            group.appendChild(titleElement);
            
            const rows = {};
            
            metrics.forEach(metric => {
                const row = document.createElement('div');
                row.className = 'metric-row';
                
                const label = document.createElement('span');
                label.className = 'metric-label';
                label.textContent = metric.label;
                
                const value = document.createElement('span');
                value.className = 'metric-value';
                value.textContent = metric.value;
                
                row.appendChild(label);
                row.appendChild(value);
                group.appendChild(row);
                
                rows[metric.label] = value;
            });
            
            group.rows = rows;
            return group;
        }
        
        // Remove a card
        function removeCard(ticker) {
            const cardIndex = cards.findIndex(card => card.ticker === ticker);
            if (cardIndex !== -1) {
                // Remove the card element from the DOM
                cards[cardIndex].element.remove();
                
                // Remove the card from the cards array
                cards.splice(cardIndex, 1);
                
                // Show the add card button if it was hidden
                document.getElementById('add-card').style.display = 'flex';
            }
        }
        
        // Fetch data for a specific card
        async function fetchCardData(ticker) {
            const card = cards.find(card => card.ticker === ticker);
            if (!card) return;
            
            try {
                // In a real app, you would fetch from your API here
                // For demonstration, we'll generate random data
                const data = generateMockData(ticker);
                
                // Update card with the data
                updateCardData(ticker, data);
                
                // Remove loading state
                card.element.classList.remove('loading');
            } catch (error) {
                console.error(`Error fetching data for ${ticker}:`, error);
                card.price.textContent = 'Error loading data';
            }
        }

        
        
        // Update data for all cards
        function updateAllCardsData() {
            cards.forEach(card => {
                fetchCardData(card.ticker);
            });
        }
        
        // Update card with new data
        function updateCardData(ticker, data) {
            const card = cards.find(card => card.ticker === ticker);
            if (!card) return;
            
            // Check if price changed and add pulse effect
            const oldPrice = card.currentPrice;
            const newPrice = data.price;
            
            if (oldPrice !== undefined && oldPrice !== newPrice) {
                card.price.classList.add('pulse');
                setTimeout(() => {
                    card.price.classList.remove('pulse');
                }, 1000);
            }
            
            // Store current price
            card.currentPrice = newPrice;
            
            // Update price display
            card.price.textContent = `$${newPrice.toFixed(2)}`;
            
            // Update RSI values
            updateMetricValues(card.metrics.rsi.rows, data.rsi, value => {
                const numValue = parseFloat(value);
                let className = 'neutral';
                if (numValue > 70) className = 'negative';
                else if (numValue < 30) className = 'positive';
                return { text: value, className };
            });
            
            // Update MACD values
            updateMetricValues(card.metrics.macd.rows, data.macd, value => {
                const numValue = parseFloat(value);
                const className = numValue >= 0 ? 'positive' : 'negative';
                return { text: value, className };
            });
            
            // Update High/Low values
            updateMetricValues(card.metrics.highLow.rows, data.highLow);
        }
        
        // Update metric values with formatting
        function updateMetricValues(rowElements, data, formatter = null) {
            for (const [timeframe, value] of Object.entries(data)) {
                if (rowElements[timeframe]) {
                    const formattedValue = formatter ? formatter(value) : { text: value, className: 'neutral' };
                    rowElements[timeframe].textContent = formattedValue.text;
                    rowElements[timeframe].className = `metric-value ${formattedValue.className}`;
                }
            }
        }
        
        // Generate mock data for demonstration
        function generateMockData(ticker) {
            const basePrice = ticker === 'BTC-USD' ? 45000 + Math.random() * 5000 :
                              ticker === 'ETH-USD' ? 2500 + Math.random() * 300 : 
                              100 + Math.random() * 50;
            
            const generateRsi = () => (Math.random() * 70 + 15).toFixed(1);
            const generateMacd = () => (Math.random() * 2 - 1).toFixed(3);
            const generateHighLow = (base) => {
                const high = base * (1 + Math.random() * 0.1);
                const low = base * (1 - Math.random() * 0.1);
                return `${low.toFixed(2)} - ${high.toFixed(2)}`;
            };
            
            return {
                price: basePrice,
                rsi: {
                    '1m': generateRsi(),
                    '5m': generateRsi(),
                    '15m': generateRsi(),
                    '1h': generateRsi(),
                    '4h': generateRsi(),
                    '1d': generateRsi()
                },
                macd: {
                    '1m': generateMacd(),
                    '5m': generateMacd(),
                    '15m': generateMacd(),
                    '1h': generateMacd(),
                    '4h': generateMacd(),
                    '1d': generateMacd()
                },
                highLow: {
                    '1d': generateHighLow(basePrice),
                    '1w': generateHighLow(basePrice),
                    '1m': generateHighLow(basePrice),
                    '6m': generateHighLow(basePrice)
                }
            };
        }
        
        // Responsive grid adjustment
        window.addEventListener('resize', () => {
            const newMaxCards = window.innerWidth >= 768 ? 19 : 9;
            if (newMaxCards !== maxCards) {
                maxCards = newMaxCards;
                
                // Show/hide add card button based on new max
                const addCardElement = document.getElementById('add-card');
                addCardElement.style.display = cards.length >= maxCards ? 'none' : 'flex';
            }
        });