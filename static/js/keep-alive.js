// Keep-Alive Service to prevent server from sleeping
class KeepAliveService {
    constructor(interval = 10 * 60 * 1000) { // 10 minutes
        this.interval = interval;
        this.isEnabled = false;
    }

    start() {
        if (this.isEnabled) return;
        
        this.isEnabled = true;
        console.log('Keep-alive service started');
        
        // Ping server every 10 minutes
        this.intervalId = setInterval(() => {
            this.ping();
        }, this.interval);
        
        // Initial ping
        this.ping();
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.isEnabled = false;
            console.log('Keep-alive service stopped');
        }
    }

    async ping() {
        try {
            await fetch(`${window.location.origin}/api`);
            console.log('Keep-alive ping sent');
        } catch (error) {
            console.log('Keep-alive ping failed:', error);
        }
    }
}

// Auto-start keep-alive when user is active
const keepAlive = new KeepAliveService();

// Start keep-alive after first user interaction
let hasStarted = false;
const startKeepAlive = () => {
    if (!hasStarted) {
        keepAlive.start();
        hasStarted = true;
    }
};

// Listen for user activity
['click', 'keypress', 'scroll'].forEach(event => {
    document.addEventListener(event, startKeepAlive, { once: true });
});

// Stop when page is hidden (save resources)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        keepAlive.stop();
    } else if (hasStarted) {
        keepAlive.start();
    }
});
