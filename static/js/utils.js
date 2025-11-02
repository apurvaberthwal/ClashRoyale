// Utility Functions

// Format numbers with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Format trophy change with + or -
function formatTrophyChange(change) {
    return change > 0 ? `+${change}` : `${change}`;
}

// Get rarity color
function getRarityColor(rarity) {
    const colors = {
        'common': '#b0b0b0',
        'rare': '#ff9500',
        'epic': '#a335ee',
        'legendary': '#ffd700',
        'champion': '#00ffff'
    };
    return colors[rarity.toLowerCase()] || '#ffffff';
}

// Get outcome color
function getOutcomeColor(outcome) {
    const colors = {
        'victory': '#4ade80',
        'defeat': '#f87171',
        'draw': '#94a3b8'
    };
    return colors[outcome.toLowerCase()] || '#ffffff';
}

// Validate player tag
function validatePlayerTag(tag) {
    if (!tag) return false;
    // Remove # if present
    const cleanTag = tag.replace('#', '');
    // Check if alphanumeric and reasonable length
    return /^[0-9A-Z]{3,15}$/i.test(cleanTag);
}

// Format player tag
function formatPlayerTag(tag) {
    if (!tag) return '';
    return tag.startsWith('#') ? tag : `#${tag}`;
}

// Calculate win rate
function calculateWinRate(wins, losses) {
    const total = wins + losses;
    if (total === 0) return '0.0';
    return ((wins / total) * 100).toFixed(1);
}

// Time ago formatter
function timeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// No caching or storage - keeping it simple!

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        formatTrophyChange,
        getRarityColor,
        getOutcomeColor,
        validatePlayerTag,
        formatPlayerTag,
        calculateWinRate,
        timeAgo,
        copyToClipboard,
        debounce
    };
}
