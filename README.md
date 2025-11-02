# 🏆 Clash Royale Stats Dashboard

A web application to view Clash Royale player stats, clan information, and browse all cards.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "CLASH_ROYALE_KEY=your_api_key_here" > .env

# Run server
python main.py
```

Visit: `http://localhost:8000`

### Docker

```bash
# Build image
docker build -t clash-royale-stats .

# Run container
docker run -p 8000:8000 --env-file .env clash-royale-stats
```

Visit: `http://localhost:8000`

## 📁 Project Structure

```
ClashRoyale/
├── static/
│   ├── html/          # Pages
│   ├── css/           # Styles
│   └── js/            # Frontend logic
├── main.py            # FastAPI backend
├── Dockerfile         # Docker configuration
└── requirements.txt   # Python dependencies
```

## ✨ Features

- 📊 Player statistics with charts
- ⚔️ Battle history
- 🃏 Card collection viewer
- 🛡️ Clan information
- 📱 Responsive design

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** FastAPI (Python)
- **Charts:** Chart.js
- **API:** Clash Royale Official API
