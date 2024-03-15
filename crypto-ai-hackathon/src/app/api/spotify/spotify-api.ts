"use server"

export async function play(musicId: string, accessToken: string, deviceId: string) {
    const uris = musicId.split(",").map((e) => `spotify:track:${e}`);
    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({"uris": uris}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });
    if (!res.ok) {
        const errorBody = await res.text();  // JSONである場合はres.json()を使用
        console.log('Error response body:', errorBody);
    }
}