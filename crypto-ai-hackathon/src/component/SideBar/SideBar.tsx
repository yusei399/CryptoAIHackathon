import styles from "@/component/SideBar/SideBar.module.css";
import common from "@/app/common.module.css";


const SideBar = () => {
    return (
        <div className={styles.container}>
            <IconButton content={"mic_none"} fontSize={40}/>
            <div className={styles.bar}/>
            <IconButton content={"skip_previous"} fontSize={36}/>
            <IconButton content={"play_circle_filled"} fontSize={48}/>
            <IconButton content={"skip_next"} fontSize={36}/>
        </div>
    );
};

type ButtonProps = {
    content: string,
    fontSize: number,
}

const IconButton = ({content, fontSize}: ButtonProps) => {
    return (
        <div className={`${common.materialIcons} ${styles.icon}`} style={{fontSize: fontSize}}>{content}</div>
    )
}

export default SideBar;