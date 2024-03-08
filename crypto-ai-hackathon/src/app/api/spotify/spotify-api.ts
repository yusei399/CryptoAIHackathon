"use server"

export async function play(playlistId: string, accessToken: string, deviceId: string) {
    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({context_uri: `spotify:playlist:${playlistId}`}),
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

export async function fetchAlbumImageUrl() {
    // 仮のURLを返す @TODO SpotifyのAPIから楽曲のアルバム画像URLを取得
    return 'https://lh3.googleusercontent.com/5evy3cAEtV0wnFBD4y7Wx6zaIpSxWg8g07aBNgrFgF7Odb4wm1shBPVJfbeJEdV17A7Br3E3VUO7Wdu0=w544-h544-l90-rj';
}