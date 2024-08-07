import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import styles from "@/src/utils/style";
import NavItems from "../NavItems";
import React from "react";

const Header = () => {
  return (
    <header className="w-full h-[80px] bg-[#0F1524] flex items-center justify-between">
      <div className="w-[90%] m-auto">
        <h1 className={`$styles.logo`}>Brayham Carvalho</h1>
        <NavItems />
      </div>
    </header>
  );
};

export default Header;
