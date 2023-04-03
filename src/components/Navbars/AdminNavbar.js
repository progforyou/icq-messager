import React from "react";

import {useStoreon} from "storeon/react";
import Controller from "../../controller/controller";
import {useCookies} from "react-cookie";
import {EditChatMW} from "../Modal/EditChat";
import {reloadTokenController} from "../../tools/reloadToken";
import {useHistory} from "react-router";
import {NavLink} from "react-router-dom";

const getText = (x) => {
  if (x === 1){
    return `Вы единственный подписчик канала`
  }
  if (x === 2 || x === 3 || x === 4 ){
    return `${x} Пользователя`
  }

  if (x % 10 === 1 && x !== 11 ){
    return `${x} Пользователь`
  }
  return `${x} Пользователей`
}

export default function AdminNavbar() {
  
  
  return (
    <>
      {/* Navbar */}
      <nav style={{height: "50px"}} className={" absolute top-0 left-0 w-full z-10 bg-white flex lg:flex-nowrap lg:justify-start items-center p-4"}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className={"flex"}>
            <div>
              <div className="text-black text-sm uppercase font-semibold sm:max-w-150 overflow-ellipsis whitespace-nowrap">
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
