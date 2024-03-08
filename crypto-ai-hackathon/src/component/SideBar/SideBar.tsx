"use client";
import {Dispatch, SetStateAction} from "react";
import styles from "./SideBar.module.css";
import common from "@/app/common.module.css";
import {MouseEventHandler} from "react";
import Recoding from "@/component/Recoding/Recoding";

type Props = {
    player: Spotify.Player | null,
    isPaused: boolean,
    setPaused: Dispatch<SetStateAction<boolean>>,
}

const SideBar = ({player, isPaused, setPaused}: Props) => {
    return (
        <div className={styles.container}>
            <Recoding isIcon={true}/>
            <div className={styles.bar}/>
            <IconButton content={"skip_previous"} fontSize={36} onClick={() => player?.previousTrack()}/>
            <IconButton content={isPaused ? "play_circle_filled" : "pause_circle_filled"} fontSize={48}
                        onClick={async () => {
                            setPaused(!isPaused);
                            if (isPaused) {
                                player?.resume();
                            } else {
                                player?.pause();
                            }
                        }}/>
            <IconButton content={"skip_next"} fontSize={36} onClick={() => player?.nextTrack()}/>
            {/* {audioUrl && <audio src={audioUrl} controls />}確認用 */}
        </div>
    );
};

type ButtonProps = {
    content: string,
    fontSize: number,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

export const IconButton = ({content, fontSize, onClick}: ButtonProps) => {
    return (
        <div className={`${common.materialIcons} ${styles.icon}`} style={{fontSize: fontSize}}
             onClick={onClick}>{content}</div>
    )
}

export default SideBar;