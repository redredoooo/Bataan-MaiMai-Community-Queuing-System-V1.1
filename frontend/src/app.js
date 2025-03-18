const API_URL = "https://bataan-maimai-api.onrender.com"; // Backend API URL

async function fetchQueue() {
    let response = await fetch(`${API_URL}/queue`);
    let queue = await response.json();

    let queueList = document.getElementById("queue-list");
    queueList.innerHTML = queue.map(p => 
        `<div class="p-2 border">${p.position}. ${p.players.name} <br><small>${p.players.joined_at}</small></div>`
    ).join("");

    document.getElementById("queue-count").innerText = queue.length;
}

async function addPlayer() {
    let name = document.getElementById("player-name").value;
    if (!name) return alert("Enter a player name!");

    await fetch(`${API_URL}/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    fetchQueue();
}

async function switchPlayers() {
    let pos1 = document.getElementById("pos1").value;
    let pos2 = document.getElementById("pos2").value;
    if (!pos1 || !pos2) return alert("Enter two positions!");

    await fetch(`${API_URL}/queue/switch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pos1, pos2 })
    });
    fetchQueue();
}

async function deleteTopPair() {
    await fetch(`${API_URL}/queue`, { method: "DELETE" });
    fetchQueue();
}

async function fetchHistory() {
    let response = await fetch(`${API_URL}/history`);
    let history = await response.json();
    
    let historyList = document.getElementById("history");
    historyList.innerHTML = history.map(h => `<p>${h.name} - ${h.timestamp}</p>`).join("");
}

async function fetchTopPlayers() {
    let response = await fetch(`${API_URL}/top-players`);
    let topPlayers = await response.json();
    
    let topList = document.getElementById("top-players");
    topList.innerHTML = topPlayers.map(t => `<p>${t.name} (${t.count} entries)</p>`).join("");
}

function updateTime() {
    let phTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    document.getElementById("ph-time").innerText = phTime;
}

setInterval(updateTime, 1000);
fetchQueue();
fetchHistory();
fetchTopPlayers();
