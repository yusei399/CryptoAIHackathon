"use client";
import styles from "./SideBar.module.css";
import common from "@/app/common.module.css";
import {MouseEventHandler, useState} from "react";


const SideBar = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    return (
        <div className={styles.container}>
            <IconButton content={"mic_none"} fontSize={40}/>
            <div className={styles.bar}/>
            <IconButton content={"skip_previous"} fontSize={36}/>
            <IconButton content={isPlaying ? "pause_circle_filled" : "play_circle_filled"} fontSize={48}
                        onClick={() => setIsPlaying(!isPlaying)}/>
            <IconButton content={"skip_next"} fontSize={36}/>
        </div>
    );
};

type ButtonProps = {
    content: string,
    fontSize: number,
    onClick?: MouseEventHandler<HTMLDivElement>,
}

const IconButton = ({content, fontSize, onClick}: ButtonProps) => {
    return (
        <div className={`${common.materialIcons} ${styles.icon}`} style={{fontSize: fontSize}}
             onClick={onClick}>{content}</div>
    )
}

export default SideBar;