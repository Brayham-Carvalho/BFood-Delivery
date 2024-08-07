import Link from "next/link";

import React from "react";

const navItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Sobre nós",
    url: "/about",
  },
  {
    title: "Restaurantes",
    url: "/restaurants",
  },
  {
    title: "Mais Populares",
    url: "/foods",
  },
  {
    title: "Contato",
    url: "/contact",
  },
];
const NavItems = ({ activeItem = 0 }: { activeItem?: number }) => {
  return (
    <div>
      {navItems.map((item, index) => (
        <Link
          key={item.url}
          href={item.url}
          className={`px-5 text-[18px] font-Poppins font-[500] text-white ${
            activeItem === index && "text-[#37b668]"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
