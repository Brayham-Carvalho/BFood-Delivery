import styles from "@/src/utils/style";
import NavItems from "../NavItems";
import React from "react";
import ProfileDropdown from "../ProfileDropdown";
import { Dropdown } from "@nextui-org/react";

const Header = () => {
  return (
    <header className="w-full  bg-[#0F1524] ">
      <div className="w-[90%] m-auto h-[80px] flex items-center justify-between">
        <h1 className={`${styles.logo}`}>Brayham Carvalho</h1>
        <NavItems activeItem={1} />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
