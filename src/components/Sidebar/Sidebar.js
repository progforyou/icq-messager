/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="px-6 md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            Чаты
          </Link>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Form */}
            <form className="mb-4 px-6">
              <div className="pt-0">
                <input
                  type="text"
                  placeholder="Поиск"
                  className="focus:shadow-none border-0 px-3 py-2 h-8 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            <ul className="h-full px-6 md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <div className={"text-xs cursor-pointer uppercase py-3 font-bold block text-lightBlue-500 hover:text-lightBlue-600"}>
                  Актив Контакт 1
                </div>
              </li>
              <li className="items-center">
                <div className={"text-xs cursor-pointer uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500"}>
                  Контакт 2
                </div>
              </li>
            </ul>

            <div className={"mt-auto"}>
              <hr className="my-2 md:min-w-full" />
              <ul className="px-6 mt-auto md:min-w-full flex justify-between list-none">
                <li className="items-center">
                  <Link
                      className="text-blueGray-700 flex flex-col  hover:text-blueGray-500 text-xs pt-3 font-bold block"
                      to="/auth/login"
                  >
                    <i className="fas fa-fingerprint mx-auto text-xl"></i>{" "}
                    Контакты
                  </Link>
                </li>

                <li className="items-center">
                  <Link
                      className="text-lightBlue-500 flex flex-col text-xs pt-3 font-bold block"
                      to="/auth/register"
                  >
                    <i className="fas fa-clipboard-list mx-auto text-xl"></i>{" "}
                    Чаты
                  </Link>
                </li>
                <li className="items-center">
                  <Link
                      className="text-blueGray-700 flex flex-col hover:text-blueGray-500 text-xs pt-3 font-bold block"
                      to="/auth/register"
                  >
                    <i className="fas mx-auto fa-cog  text-xl"></i>{" "}
                    Настройки
                  </Link>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </nav>
    </>
  );
}
