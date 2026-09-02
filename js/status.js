const discordUserId = "999344456954302515";

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        const data = await response.json();

        if (data.success) {
            const status = data.data.discord_status; 
            const activities = data.data.activities; 
            
            // 1. Handle Custom Status Text
            let customStatusText = "";
            const customActivity = activities.find(act => act.type === 4);
            if (customActivity && customActivity.state) {
                customStatusText = customActivity.state;
            }
            
            const statusEl = document.getElementById("statusthing");
            if (statusEl) {
                if (customStatusText) {
                    statusEl.innerHTML = `<div style="border:3px solid #2e2e2e;color:#ffff;border-radius: 1.3px;background: #000; padding: 10px;"><-- My Status: <b style="color: #a351da;">${customStatusText}</b> --></div>`;
                } else {
                    statusEl.innerHTML = `<div style="border:3px solid #2e2e2e;color:#ffff;border-radius: 1.3px;background: #000; padding: 10px;"><-- My Status: <b style="color: #1DB954;">${status}</b> --></div>`;
                }
            }

            // 2. Handle Spotify Track
            const spotifyEl = document.getElementById("spotify-status");
            if (spotifyEl) {
                if (data.data.spotify && data.data.spotify.song) {
                    const song = data.data.spotify.song;
                    const artist = data.data.spotify.artist;
                    spotifyEl.innerHTML = `<div style="border:3px solid #2e2e2e;color:#ffff;border-radius: 1.3px;background: #000; padding: 10px;"><-- Listening to: <b style="color: #1DB954;">${song}</b> by <b style="color: #541db9;">${artist}</b> --></div>`;
                } else {
                    spotifyEl.innerHTML = `<div style="border:3px solid #2e2e2e;color:#ffff;border-radius: 1.3px;background: #000; padding: 10px;"><-- Listening to: <b style="color: #a351da;">Not listening to anything..</b> --></div>`;
                }
            }
        }
    } catch (err) {
        console.error("Failed to fetch Discord status", err);
    }
}


fetchDiscordStatus();
setInterval(fetchDiscordStatus, 300); 