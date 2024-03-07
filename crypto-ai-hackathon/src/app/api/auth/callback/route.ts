import {NextResponse, NextRequest} from "next/server";
import axios from "axios";
import { CookieSerializeOptions } from 'cookie';

type SpotifyAuthApiResponse = {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
};

interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number; // 有効期限を秒単位で設定
    path: string;
}

const setCookie = (res: NextResponse, name: string, value: unknown, options: CookieOptions) => {
    const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

    // Next.js の Response オブジェクトに cookie を設定
    res.cookies.set(name, stringValue, options);
};

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const code = url.searchParams.get("code");
    const spotify_redirect_uri = process.env.REDIRECT_URL ?? "";

    let spotify_client_id: string = process.env.SPOTIFY_CLIENT_ID || "";
    let spotify_client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || "";

    if (!spotify_client_id || !spotify_client_secret) {
        console.error(
            'Undefined Error: Environmental variables "SPOTIFY_CLIENT_ID" or "SPOTIFY_CLIENT_SECRET" are missing.'
        );
        return new Response(null, {status: 500});
    }

    const params = new URLSearchParams({
        code: code || "", // `code` が null または undefined の場合、空文字列を使用
        redirect_uri: spotify_redirect_uri || "", // `spotify_redirect_uri` が undefined の場合、空文字列を使用
        grant_type: "authorization_code",
    });

    try {
        const response = await axios.post<SpotifyAuthApiResponse>(
            "https://accounts.spotify.com/api/token",
            params,
            {
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString("base64"),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (response.data.access_token) {
            const res = NextResponse.redirect(new URL("/", req.url));
            setCookie(res, "spotify-token", response.data.access_token, {
                httpOnly: true, // または必要に応じて false
                secure: true,
                maxAge: 3600, // 1時間
                path: "/"
            });
            return res;
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        return new Response(null, {status: 500});
    }
}