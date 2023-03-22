import React from "react";

import {useStoreon} from "storeon/react";
import Controller from "../../controller/controller";
import {useCookies} from "react-cookie";
import {EditChatMW} from "../Modal/EditChat";

export default function Navbar() {
  const { dispatch, contacts } = useStoreon('contacts')
  const [showEditChat, setShowEditChat] = React.useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token', 'login']);
  const hid = contacts.active === 0 ? "hidden" : ""
  const signOut = async (e) => {
    e.preventDefault();
    let login = cookies.login
    let r = await Controller().signOut({login})
    if (r && r.status === 201){
      removeCookie('access_token');
      removeCookie('refresh_token');
      removeCookie('login');
    }
  }
  return (
    <>
      {/* Navbar */}
      <nav style={{height: "50px"}} className={hid + " absolute top-0 left-0 w-full z-10 bg-white flex lg:flex-nowrap lg:justify-start items-center p-4"}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className={"flex"}>
            <div className={"flex md:hidden mr-3"}>
              <i onClick={() => {
                dispatch("contacts/setActive", 0)
              }} className={"fa fa-arrow-left"}></i>
            </div>
            <a
                className="text-black text-sm uppercase font-semibold"
                href={"#"}
                onClick={(e) => {
                  e.preventDefault()
                  setShowEditChat(true)
                }}
            >
              {contacts.list.filter(e => e.id === contacts.active)[0]?.title}
            </a>
          </div>
          <div >
            <button onClick={signOut} className={"ml-auto mr-3 bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 ease-linear transition-all duration-150"}>Выйти</button>
          </div>
          {/* Form */}
          {/* User */}
        </div>
      </nav>
      {showEditChat ? <EditChatMW onHide={() => {setShowEditChat(false)}}/> : null}
      {/* End Navbar */}
    </>
  );
}
