const API_URL = "https://your-backend-url.onrender.com";

async function fetchQueue() {
    let response = await fetch(`${API_URL}/queue`);
    let queue = await response.json();
    document.getElementById("queue-list").innerHTML = queue
        .map(p => `<p>${p.players.name} - ${p.players.joined_at}</p>`)
        .join("");
}

async function addPlayer() {
    let name = document.getElementById("player-name").value;
    await fetch(`${API_URL}/queue`, { method: "POST", body: JSON.stringify({ name }) });
    fetchQueue();
}

async function switchPlayers() {
    let pos1 = document.getElementById("pos1").value;
    let pos2 = document.getElementById("pos2").value;
    await fetch(`${API_URL}/queue/switch`, { method: "POST", body: JSON.stringify({ pos1, pos2 }) });
    fetchQueue();
}

async function deleteTopPair() {
    await fetch(`${API_URL}/queue`, { method: "DELETE" });
    fetchQueue();
}

fetchQueue();
