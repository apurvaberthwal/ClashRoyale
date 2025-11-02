// UI Controller
class UIController {
    constructor() {
        this.loadingEl = document.getElementById('loading');
        this.resultEl = document.getElementById('result');
    }

    showLoading(message = 'Loading data...') {
        this.loadingEl.style.display = 'block';
        this.resultEl.style.display = 'none';
        
        // Update loading message
        const loadingText = this.loadingEl.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        // Show cold start message after 3 seconds
        this.coldStartTimeout = setTimeout(() => {
            if (loadingText) {
                loadingText.innerHTML = `
                    ${message}<br>
                    <span style="font-size: 0.9rem; opacity: 0.7; margin-top: 10px; display: block;">
                        ⏳ Server is waking up from sleep... This may take 20-30 seconds
                    </span>
                `;
            }
        }, 3000);
    }

    hideLoading() {
        this.loadingEl.style.display = 'none';
        
        // Clear cold start timeout
        if (this.coldStartTimeout) {
            clearTimeout(this.coldStartTimeout);
        }
        
        // Reset loading message
        const loadingText = this.loadingEl.querySelector('p');
        if (loadingText) {
            loadingText.textContent = 'Loading data...';
        }
    }

    showResult() {
        this.resultEl.style.display = 'block';
    }

    showError(message) {
        this.resultEl.innerHTML = `
            <div class="error">
                ❌ ${message}
            </div>
        `;
        this.showResult();
    }

    clearResult() {
        this.resultEl.innerHTML = '';
    }

    getCardImageUrl(iconUrl) {
        // Official Clash Royale API provides icon URLs
        return iconUrl || 'https://via.placeholder.com/80?text=Card';
    }

    getArenaImageUrl(iconUrl) {
        return iconUrl || 'https://via.placeholder.com/60?text=Arena';
    }

    getBadgeImageUrl(iconUrl) {
        return iconUrl || 'https://via.placeholder.com/30?text=Badge';
    }

    renderPlayerProfile(data) {
        const player = data.player;
        
        return `
            <div class="player-card">
                <div class="player-header">
                    <div class="player-info">
                        ${player.arena && player.arena.iconUrls ? 
                            `<img src="${player.arena.iconUrls.large || player.arena.iconUrls.medium}" 
                                 alt="Arena" class="player-avatar">` : ''}
                        <div class="player-details">
                            <h2>${player.name}</h2>
                            <p class="player-tag">${player.tag}</p>
                        </div>
                    </div>
                </div>

                ${this.renderStatsGrid(player, data)}
                ${this.renderArenaInfo(player)}
                ${this.renderClanInfo(player)}
                ${this.renderBadges(data.top_badges)}
                ${this.renderLeagueStats(data.league_stats)}
            </div>
        `;
    }

    renderStatsGrid(player, data) {
        return `
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-value">${player.trophies.toLocaleString()}</div>
                    <div class="stat-label">Trophies</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">${player.expLevel}</div>
                    <div class="stat-label">King Level</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-value">${data.stats.win_rate}</div>
                    <div class="stat-label">Win Rate</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">✅</div>
                    <div class="stat-value">${player.wins.toLocaleString()}</div>
                    <div class="stat-label">Total Wins</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">❌</div>
                    <div class="stat-value">${player.losses.toLocaleString()}</div>
                    <div class="stat-label">Total Losses</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">🃏</div>
                    <div class="stat-value">${player.cards.length}</div>
                    <div class="stat-label">Cards Found</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">⚔️</div>
                    <div class="stat-value">${player.battleCount || 0}</div>
                    <div class="stat-label">Total Battles</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">🎁</div>
                    <div class="stat-value">${player.donations || 0}</div>
                    <div class="stat-label">Donations</div>
                </div>
            </div>
        `;
    }

    renderArenaInfo(player) {
        if (!player.arena) return '';
        
        return `
            <div class="arena-info">
                ${player.arena.iconUrls ? 
                    `<img src="${player.arena.iconUrls.large || player.arena.iconUrls.medium}" 
                         alt="${player.arena.name}" class="arena-icon">` : ''}
                <div class="arena-details">
                    <h3>${player.arena.name}</h3>
                    <p>Arena ID: ${player.arena.id}</p>
                </div>
            </div>
        `;
    }

    renderClanInfo(player) {
        if (!player.clan) return '';
        
        return `
            <div class="stat-box" style="margin-top: 20px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    ${player.clan.badgeUrls ? 
                        `<img src="${player.clan.badgeUrls.large || player.clan.badgeUrls.medium}" 
                             alt="Clan Badge" class="clan-badge">` : ''}
                    <div>
                        <div class="stat-value" style="font-size: 1.5rem;">🛡️ ${player.clan.name}</div>
                        <div class="stat-label">${player.clan.tag}</div>
                        <div class="stat-label">Role: ${player.role || 'Member'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBadges(badges) {
        if (!badges || badges.length === 0) return '';
        
        return `
            <h3 class="section-title">🏅 Achievements</h3>
            <div class="badges-container">
                ${badges.map(badge => `
                    <div class="badge-item">
                        ${badge.iconUrls ? 
                            `<img src="${badge.iconUrls.large || badge.iconUrls.medium}" 
                                 alt="${badge.name}" class="badge-icon">` : ''}
                        <span>${badge.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderLeagueStats(leagueStats) {
        if (!leagueStats) return '';
        
        return `
            <h3 class="section-title">🏆 League Statistics</h3>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">${leagueStats.current}</div>
                    <div class="stat-label">Current Season</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">📈</div>
                    <div class="stat-value">${leagueStats.previous}</div>
                    <div class="stat-label">Previous Season</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">🌟</div>
                    <div class="stat-value">${leagueStats.best}</div>
                    <div class="stat-label">Best Season</div>
                </div>
            </div>
        `;
    }

    renderCurrentDeck(deck) {
        if (!deck || deck.length === 0) return '';
        
        return `
            <div class="player-card">
                <h3 class="section-title">🎴 Current Battle Deck</h3>
                <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); max-width: 900px; margin: 20px auto;">
                    ${deck.map(card => this.renderCard(card)).join('')}
                </div>
            </div>
        `;
    }

    renderCard(card) {
        return `
            <div class="card-item-original" title="${card.name} - ${card.rarity} - Level ${card.level}">
                ${card.iconUrls ? 
                    `<img src="${card.iconUrls.medium || card.iconUrls.evolutionMedium}" 
                         alt="${card.name}" class="card-original-image">` : ''}
                <div class="card-level-badge">Lv ${card.level}</div>
            </div>
        `;
    }

    renderCardCollection(cards) {
        if (!cards || cards.length === 0) return '';
        
        return `
            <div class="player-card">
                <h3 class="section-title">🗂️ Card Collection (${cards.length} cards)</h3>
                <div class="cards-grid" id="cards-container">
                    ${cards.map(card => this.renderCard(card)).join('')}
                </div>
            </div>
        `;
    }

    renderBattles(battles) {
        if (!battles || !battles.items || battles.items.length === 0) return '';
        
        return `
            <div class="player-card">
                <h3 class="section-title">⚔️ Battle History (${battles.items.length} battles)</h3>
                <div class="battles-list" id="battles-container">
                    ${battles.items.map((battle, index) => this.renderBattle(battle, index)).join('')}
                </div>
            </div>
        `;
    }

    renderBattle(battle, index) {
        return `
            <div class="battle-item battle-${battle.outcome.toLowerCase()}" onclick="toggleBattle(this)">
                <div class="battle-header">
                    <span class="battle-mode">🎮 ${battle.mode}</span>
                    <span class="battle-outcome outcome-${battle.outcome.toLowerCase()}">
                        ${battle.outcome}
                    </span>
                </div>
                <div class="battle-details">
                    <div class="battle-detail-item">
                        <strong>👤 Opponent:</strong> ${battle.opponent_name}
                    </div>
                    <div class="battle-detail-item">
                        <strong>💪 Deck Power:</strong> ${battle.deck_power}
                    </div>
                    <div class="battle-detail-item">
                        <strong>🏆 Trophy Change:</strong> 
                        <span style="color: ${battle.trophy_change >= 0 ? '#4ade80' : '#f87171'}; font-weight: bold;">
                            ${battle.trophy_change > 0 ? '+' : ''}${battle.trophy_change}
                        </span>
                    </div>
                </div>
                <div class="battle-expanded-content">
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <p style="opacity: 0.8; font-size: 0.9rem;">
                            <strong>💡 Click to expand for more details</strong><br>
                            Battle Time: ${battle.battleTime || 'N/A'}<br>
                            Game Mode: ${battle.mode}<br>
                            ${battle.type ? `Type: ${battle.type}` : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderPlayerData(data) {
        const html = `
            ${this.renderPlayerProfile(data)}
            ${this.renderCardRarityChart(data.player.cards)}
            ${this.renderWinRateChart(data.player)}
            ${this.renderCurrentDeck(data.deck)}
            ${this.renderCardCollection(data.player.cards)}
            ${this.renderBattles(data.battles)}
        `;
        
        this.resultEl.innerHTML = html;
        this.showResult();
        
        // Initialize charts after rendering
        setTimeout(() => {
            this.initializeCharts(data);
        }, 100);
    }

    renderCardRarityChart(cards) {
        return `
            <div class="player-card">
                <h3 class="section-title">📊 Card Collection Analysis</h3>
                <div class="chart-container-compact">
                    <canvas id="rarityChart" style="max-height: 250px;"></canvas>
                </div>
            </div>
        `;
    }

    renderWinRateChart(player) {
        return `
            <div class="player-card">
                <h3 class="section-title">📈 Win/Loss Statistics</h3>
                <div class="chart-container-compact">
                    <canvas id="winRateChart" style="max-height: 250px;"></canvas>
                </div>
            </div>
        `;
    }

    initializeCharts(data) {
        // Card Rarity Chart
        const rarityCount = {};
        data.player.cards.forEach(card => {
            rarityCount[card.rarity] = (rarityCount[card.rarity] || 0) + 1;
        });

        const rarityCtx = document.getElementById('rarityChart');
        if (rarityCtx) {
            new Chart(rarityCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(rarityCount),
                    datasets: [{
                        data: Object.values(rarityCount),
                        backgroundColor: [
                            '#b0b0b0',  // Common
                            '#ff9500',  // Rare
                            '#a335ee',  // Epic
                            '#ffd700',  // Legendary
                            '#00ffff'   // Champion
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: { color: '#fff', font: { size: 12 }, padding: 10 }
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        }

        // Win/Loss Chart
        const winRateCtx = document.getElementById('winRateChart');
        if (winRateCtx) {
            new Chart(winRateCtx, {
                type: 'bar',
                data: {
                    labels: ['Wins', 'Losses', '3 Crown'],
                    datasets: [{
                        label: 'Battles',
                        data: [
                            data.player.wins,
                            data.player.losses,
                            data.player.threeCrownWins || 0
                        ],
                        backgroundColor: ['#4ade80', '#f87171', '#ffd700'],
                        borderWidth: 0,
                        barThickness: 40
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 3,
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#fff', font: { size: 11 } },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        x: {
                            ticks: { color: '#fff', font: { size: 11 } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    renderClanData(clan) {
        const html = `
            <div class="player-card">
                <div class="player-header">
                    <div class="player-info">
                        ${clan.badgeUrls ? 
                            `<img src="${clan.badgeUrls.large || clan.badgeUrls.medium}" 
                                 alt="Clan Badge" class="player-avatar">` : ''}
                        <div class="player-details">
                            <h2>${clan.name}</h2>
                            <p class="player-tag">${clan.tag}</p>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-icon">👥</div>
                        <div class="stat-value">${clan.members}</div>
                        <div class="stat-label">Members</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-value">${clan.clanScore.toLocaleString()}</div>
                        <div class="stat-label">Clan Score</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">⚔️</div>
                        <div class="stat-value">${clan.clanWarTrophies || 0}</div>
                        <div class="stat-label">War Trophies</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${clan.requiredTrophies.toLocaleString()}</div>
                        <div class="stat-label">Required Trophies</div>
                    </div>
                </div>

                ${clan.description ? `
                    <div style="margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                        <strong>Description:</strong> ${clan.description}
                    </div>
                ` : ''}

                <h3 class="section-title">👥 Members (${clan.memberList.length})</h3>
                <div class="battles-list">
                    ${clan.memberList.slice(0, 20).map(member => `
                        <div class="battle-item">
                            <div class="battle-header">
                                <span class="battle-mode">${member.name}</span>
                                <span class="battle-outcome outcome-victory">${member.role}</span>
                            </div>
                            <div class="battle-details">
                                <div class="battle-detail-item">
                                    <strong>🏆 Trophies:</strong> ${member.trophies.toLocaleString()}
                                </div>
                                <div class="battle-detail-item">
                                    <strong>⭐ Level:</strong> ${member.expLevel}
                                </div>
                                <div class="battle-detail-item">
                                    <strong>🎁 Donations:</strong> ${member.donations}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.resultEl.innerHTML = html;
        this.showResult();
    }

    renderAllCards(data) {
        const cards = data.items || [];
        
        const html = `
            <div class="player-card">
                <h2 class="section-title">🃏 All Clash Royale Cards (${cards.length})</h2>
                <div class="cards-grid">
                    ${cards.map(card => `
                        <div class="card-item-original" title="${card.name} - ${card.rarity} - Max Level ${card.maxLevel}">
                            ${card.iconUrls ? 
                                `<img src="${card.iconUrls.medium || card.iconUrls.evolutionMedium}" 
                                     alt="${card.name}" class="card-original-image">` : ''}
                            <div class="card-level-badge">Max ${card.maxLevel}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.resultEl.innerHTML = html;
        this.showResult();
    }
}


// Export UI instance
const ui = new UIController();
