"use client"
import React, {useEffect, useState} from "react";
import Home from "@/app/Home";
import styles from "@/app/page.module.css";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const accessToken = getCookie('spotify-token');
        if (accessToken) {
            setToken(accessToken)
        }
    }, []);

    return (
        <main className={styles.main}>
            {(token === '') ? <LoginButton/> : <Home token={token}/>}
        </main>
    );
}

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookiePart = parts.pop()?.split(';').shift();
        return cookiePart; 
    }
    return undefined;
}


const LoginButton = () => {
    return (
        <div className={styles.container}>
            <Link className={styles.loginButton} href="/api/auth/login">
                <Image className={styles.spotify} src="/spotify.png" width={16} height={16} alt=""/>
                <span>Spotifyに接続する</span>
            </Link>
        </div>
    );
}

export default Page