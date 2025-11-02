from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="Clash Royale API Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

API_KEY = os.getenv("CLASH_ROYALE_KEY")
if not API_KEY:
    raise ValueError("CLASH_ROYALE_KEY not set in .env!")

BASE_URL = "https://api.clashroyale.com/v1"
headers = {"Authorization": f"Bearer {API_KEY}"}

class PlayerTag(BaseModel):
    tag: str

# Page Routes
@app.get("/")
async def root():
    return FileResponse("static/html/index.html")

@app.get("/player")
async def player_page():
    return FileResponse("static/html/index.html")

@app.get("/clan")
async def clan_page():
    return FileResponse("static/html/clan.html")

@app.get("/cards")
async def cards_page():
    return FileResponse("static/html/cards.html")

# API Routes
@app.get("/api")
async def api_info():
    return {"message": "Clash Royale API Proxy Running!", "version": "2.0"}

@app.get("/api/player/{tag}")
@app.post("/api/player")
async def get_player_data(tag: str = None, player: Optional[PlayerTag] = None):
    if player:
        tag = player.tag
    if not tag.startswith("#"):
        tag = "#" + tag.lstrip("#")

    try:
        player_url = f"{BASE_URL}/players/{requests.utils.quote(tag)}"
        player_resp = requests.get(player_url, headers=headers)
        player_resp.raise_for_status()
        player_data = player_resp.json()

        battles_url = f"{BASE_URL}/players/{requests.utils.quote(tag)}/battlelog"
        battles_resp = requests.get(battles_url, headers=headers)
        battles_resp.raise_for_status()
        battles_data = battles_resp.json()

        # Enhanced battle processing
        total_battles = len(battles_data)
        wins = 0
        processed_battles = []
        for battle in battles_data:
            team = battle.get("team", [])
            opponent = battle.get("opponent", [])
            if not team or not opponent:
                continue

            my_team = team[0]
            opp = opponent[0]

            my_crowns = my_team.get("crowns", 0)
            opp_crowns = opp.get("crowns", 0)
            outcome = "victory" if my_crowns > opp_crowns else "defeat" if my_crowns < opp_crowns else "draw"
            if outcome == "victory":
                wins += 1

            deck_power = my_team.get("startingTrophies", 0)
            mode = battle.get("gameMode", {}).get("name", "Unknown")
            mode = mode.replace("Ladder", "PvP").replace("CW_Duel_1v1", "Clan War Duel")
            processed_battles.append({
                "mode": mode,
                "outcome": outcome.capitalize(),
                "deck_power": deck_power,
                "opponent_name": opp.get("name", "Unknown"),
                "trophy_change": my_team.get("trophyChange", 0)
            })

        win_rate = (wins / total_battles * 100) if total_battles > 0 else 0

        # Top 3 badges
        top_badges = player_data.get("badges", [])[:3]

        # League stats
        league_stats = player_data.get("leagueStatistics", {})
        current_season = league_stats.get("currentSeason", {})
        previous_season = league_stats.get("previousSeason", {})
        best_season = league_stats.get("bestSeason", {})

        return {
            "player": player_data,
            "battles": {"items": processed_battles[:5]},
            "stats": {"total_battles": total_battles, "win_rate": f"{win_rate:.1f}%" },
            "deck": player_data.get("currentDeck", []),
            "top_badges": top_badges,
            "league_stats": {
                "current": f"{current_season.get('trophies', 0)} (Best: {current_season.get('bestTrophies', 0)})",
                "previous": f"{previous_season.get('trophies', 0)}",
                "best": f"{best_season.get('trophies', 0)} in {best_season.get('id', 'Unknown')}"
            }
        }

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Player not found")
        raise HTTPException(status_code=500, detail="API error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.get("/api/clan/{tag}")
async def get_clan_data(tag: str):
    if not tag.startswith("#"):
        tag = "#" + tag.lstrip("#")

    try:
        clan_url = f"{BASE_URL}/clans/{requests.utils.quote(tag)}"
        clan_resp = requests.get(clan_url, headers=headers)
        clan_resp.raise_for_status()
        return clan_resp.json()
    except:
        raise HTTPException(status_code=404, detail="Clan not found")

@app.get("/api/cards")
async def get_all_cards():
    """Get all available cards in Clash Royale"""
    try:
        cards_url = f"{BASE_URL}/cards"
        response = requests.get(cards_url, headers=headers)
        response.raise_for_status()
        cards_data = response.json()
        
        # Add icon URLs to cards
        for card in cards_data.get("items", []):
            card_id = card.get("id")
            if card_id:
                card["iconUrl"] = f"https://api-assets.clashroyale.com/cards/{card_id}.png"
        
        return cards_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cards: {e}")

@app.get("/api/challenges")
async def get_challenges():
    """Get current global tournaments and challenges"""
    try:
        challenges_url = f"{BASE_URL}/challenges"
        response = requests.get(challenges_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching challenges: {e}")

@app.get("/api/tournaments/{tag}")
async def get_tournament(tag: str):
    """Get tournament information by tag"""
    if not tag.startswith("#"):
        tag = "#" + tag.lstrip("#")
    
    try:
        tournament_url = f"{BASE_URL}/tournaments/{requests.utils.quote(tag)}"
        response = requests.get(tournament_url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Tournament not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)