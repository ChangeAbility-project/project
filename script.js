/* ======================================
   Custom Cursor System
   ====================================== */

class CustomCursor {
    constructor() {
        this.innerCursor = document.querySelector('.cursor-inner');
        this.outerCursor = document.querySelector('.cursor-outer');
        
        this.innerX = 0;
        this.innerY = 0;
        this.outerX = 0;
        this.outerY = 0;
        
        this.isHovering = false;
        this.easeAmount = 0.12; // Delay/lag factor for outer cursor
        
        this.init();
    }

    init() {
        // Check if touch device
        if (this.isTouchDevice()) return;

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
        document.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        
        this.addHoverListeners();
        this.animate();
    }

    isTouchDevice() {
        return (
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0) ||
            window.matchMedia('(hover: none)').matches
        );
    }

    onMouseMove(e) {
        this.innerX = e.clientX;
        this.innerY = e.clientY;
        
        this.innerCursor.style.left = this.innerX + 'px';
        this.innerCursor.style.top = this.innerY + 'px';
    }

    onMouseEnter(e) {
        this.innerCursor.style.opacity = '1';
        this.outerCursor.style.opacity = '0.6';
    }

    onMouseLeave(e) {
        this.innerCursor.style.opacity = '0';
        this.outerCursor.style.opacity = '0';
    }

    addHoverListeners() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .nav-link, .work-link, .contact-link, .cta-button, input, textarea'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => this.onElementHover());
            el.addEventListener('mouseleave', () => this.onElementLeave());
        });
    }

    onElementHover() {
        this.isHovering = true;
        this.outerCursor.classList.add('cursor-hover');
    }

    onElementLeave() {
        this.isHovering = false;
        this.outerCursor.classList.remove('cursor-hover');
    }

    animate() {
        // Ease out animation for outer cursor following inner cursor
        this.outerX += (this.innerX - this.outerX) * this.easeAmount;
        this.outerY += (this.innerY - this.outerY) * this.easeAmount;

        this.outerCursor.style.left = this.outerX + 'px';
        this.outerCursor.style.top = this.outerY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

/* Initialize cursor when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});

/* ======================================
   Data Fetching & Chart Simulation
   ====================================== */

class DataDashboard {
    constructor() {
        this.data = {
            temperature: [],
            humidity: [],
            pressure: [],
            timestamps: []
        };
        
        this.chart = null;
        this.init();
    }

    init() {
        // Initialize chart if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            this.initChart();
        }
        
        // Fetch data on page load
        this.fetchESP32Data();
        
        // Set up interval to fetch data every 5 seconds
        setInterval(() => this.fetchESP32Data(), 5000);
    }

    /**
     * Simulate fetching data from ESP32
     * In a real scenario, this would connect to an actual ESP32 API endpoint
     */
    async fetchESP32Data() {
        try {
            // Simulated API endpoint - replace with actual ESP32 IP/endpoint
            const response = await fetch('/api/sensor-data', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).catch(() => {
                // Fallback: Generate mock data if API is unavailable
                return this.generateMockData();
            });

            if (response.ok) {
                const data = await response.json();
                this.updateDashboard(data);
            } else {
                this.updateDashboard(this.generateMockData());
            }
        } catch (error) {
            console.log('Using mock data:', error);
            this.updateDashboard(this.generateMockData());
        }
    }

    /**
     * Generate mock sensor data for demonstration
     */
    generateMockData() {
        const now = new Date();
        return {
            temperature: (20 + Math.random() * 10).toFixed(2),
            humidity: (40 + Math.random() * 30).toFixed(2),
            pressure: (1013 + Math.random() * 5).toFixed(2),
            timestamp: now.toLocaleTimeString()
        };
    }

    /**
     * Update dashboard with fetched data
     */
    updateDashboard(data) {
        // Update stat boxes if they exist
        const tempElement = document.getElementById('current-temp');
        const humidElement = document.getElementById('current-humidity');
        const pressElement = document.getElementById('current-pressure');

        if (tempElement) tempElement.textContent = data.temperature + '°C';
        if (humidElement) humidElement.textContent = data.humidity + '%';
        if (pressElement) pressElement.textContent = data.pressure + ' hPa';

        // Add data to arrays for chart
        this.data.temperature.push(parseFloat(data.temperature));
        this.data.humidity.push(parseFloat(data.humidity));
        this.data.pressure.push(parseFloat(data.pressure));
        this.data.timestamps.push(data.timestamp);

        // Keep only last 20 data points
        if (this.data.temperature.length > 20) {
            this.data.temperature.shift();
            this.data.humidity.shift();
            this.data.pressure.shift();
            this.data.timestamps.shift();
        }

        // Update chart if it exists
        if (this.chart) {
            this.updateChart();
        }
    }

    /**
     * Initialize Chart.js chart
     */
    initChart() {
        const ctx = document.getElementById('sensor-chart');
        if (!ctx) return;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.timestamps,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: this.data.temperature,
                        borderColor: '#000000',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false,
                        pointRadius: 3,
                        pointBackgroundColor: '#000000',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Humidity (%)',
                        data: this.data.humidity,
                        borderColor: '#757575',
                        backgroundColor: 'rgba(117, 117, 117, 0.05)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false,
                        pointRadius: 3,
                        pointBackgroundColor: '#757575',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
                                size: 12
                            },
                            color: '#1a1a1a',
                            padding: 20
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#e0e0e0',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#757575',
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#757575',
                            font: {
                                size: 11
                            },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }

    /**
     * Update existing chart with new data
     */
    updateChart() {
        if (!this.chart) return;

        this.chart.data.labels = this.data.timestamps;
        this.chart.data.datasets[0].data = this.data.temperature;
        this.chart.data.datasets[1].data = this.data.humidity;
        this.chart.update('none'); // Update without animation for real-time feel
    }
}

/* Initialize dashboard when on data page */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sensor-chart') || document.getElementById('current-temp')) {
        new DataDashboard();
    }
});

/* ======================================
   Smooth Scroll Enhancement
   ====================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ======================================
   Page Load Animation
   ====================================== */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
