import {redirect} from "next/navigation";

const generateRandomString = (length: number): string => {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export function GET() {
    const scope: string = "streaming user-read-email user-read-private";
    const spotify_redirect_uri = process.env.REDIRECT_URL;
    const state: string = generateRandomString(16);

    let spotify_client_id: string = "";
    if (process.env.SPOTIFY_CLIENT_ID) {
        spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
    } else {
        console.error(
            'Undefined Error: An environmental variable, "SPOTIFY_CLIENT_ID", has something wrong.'
        );
    }
    // console.log(spotify_client_id)

    const redirect_uri = spotify_redirect_uri || "";

    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id, // この値は既に `string` 型として確保されています
        scope: scope,
        redirect_uri: redirect_uri, // 修正された `redirect_uri` を使用
        state: state,
    });

    redirect(
        "https://accounts.spotify.com/authorize/?" +
        auth_query_parameters.toString()
    );
}