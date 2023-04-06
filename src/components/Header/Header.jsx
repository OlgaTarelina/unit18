import React from "react";
import s from "../Layout/Layout.module.css";
const Header = () => {

    return (  <header className={s.header}>
        <div className={s.header__logo}>Awesome Kanban Board</div>
        <button className={s.header__cabinet}> LK </button>
    </header>)
}

export default Header