import React from "react";
import style from "./style.module.css";

const Spinner = () => {
  return (
    <div className={style.loader}>
      <p className={style.heading}>Loading</p>
      <div className={style.loading}>
        <div className={style.load}></div>
        <div className={style.load}></div>
        <div className={style.load}></div>
        <div className={style.load}></div>
      </div>
    </div>
  );
};

export default Spinner;
