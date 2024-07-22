import React, {useState} from "react";
import LightButton from "../../src/assets/website/light-mode-button.png";
import DarkButton from "../../src/assets/website/dark-mode-button.png";
import { useSelector } from "react-redux";

const DarkMode = () => {
 const {theme} = useSelector((state)=> state.theme)

  const element = document.documentElement;

 

  return (
    <div className="relative">
      <img
        src={LightButton}
        alt=""
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 absolute right-0 z-10 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={DarkButton}
        alt=""
      
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default DarkMode;
