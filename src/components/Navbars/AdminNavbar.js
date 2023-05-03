import React from "react";

import {NavLink} from "react-router-dom";

export default function AdminNavbar() {
  
  
  return (
    <>
      {/* Navbar */}
      <nav style={{height: "50px"}} className={" absolute top-0 left-0 w-full z-10 bg-white flex lg:flex-nowrap lg:justify-start items-center p-4"}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className={"flex"}>
            <div>
              <div className="text-black text-sm uppercase font-semibold sm:max-w-120 overflow-ellipsis whitespace-nowrap">
                <ul className={"flex"}>
                  <li className={"mr-3"}>
                    <NavLink className={"text-blueGray-600 hover:text-blueGray-500 text-sm uppercase hidden lg:inline-block font-semibold"} to={"/admin"}>Список пользователей</NavLink>
                  </li>
                  <li>
                    <NavLink className={"text-blueGray-600 hover:text-blueGray-500 text-sm uppercase hidden lg:inline-block font-semibold"} to={"/admin/settings"}>Настройки</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
