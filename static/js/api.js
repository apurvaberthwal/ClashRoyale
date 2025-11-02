// API Configuration
const API_CONFIG = {
    // Use relative URL - works both locally and when deployed together
    BASE_URL: window.location.origin,
    ENDPOINTS: {
        PLAYER: '/api/player',
        CLAN: '/api/clan',
        CARDS: '/api/cards',
        CHALLENGES: '/api/challenges',
        TOURNAMENT: '/api/tournaments'
    }
};

// API Service
class ClashRoyaleAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.checkServerStatus();
    }

    async checkServerStatus() {
        // Ping server on page load to wake it up if sleeping
        try {
            const start = Date.now();
            await fetch(`${this.baseUrl}/api`);
            const duration = Date.now() - start;
            
            // If response took > 5 seconds, it was probably sleeping
            if (duration > 5000) {
                console.log('Server was sleeping, now awake!');
            }
        } catch (error) {
            console.log('Server check failed, might be cold starting');
        }
    }

    async fetchWithTimeout(url, options = {}, timeout = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server might be waking up. Please try again.');
            }
            throw error;
        }
    }

    async fetchPlayerData(tag) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.PLAYER}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tag })
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Player not found. Please check the tag and try again.');
                }
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching player data:', error);
            throw error;
        }
    }

    async fetchClanData(tag) {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.CLAN}/${encodeURIComponent(tag)}`
            );
            
            if (!response.ok) {
                throw new Error('Clan not found');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching clan data:', error);
            throw error;
        }
    }

    async fetchAllCards() {
        try {
            const response = await this.fetchWithTimeout(
                `${this.baseUrl}${API_CONFIG.ENDPOINTS.CARDS}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching cards:', error);
            throw error;
        }
    }

    async fetchChallenges() {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.CHALLENGES}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch challenges');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching challenges:', error);
            throw error;
        }
    }
}

// Export API instance
const api = new ClashRoyaleAPI(API_CONFIG.BASE_URL);
