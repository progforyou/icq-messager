import React from "react";

import {useStoreon} from "storeon/react";
import Controller from "../../controller/controller";
import {useCookies} from "react-cookie";
import {EditChatMW} from "../Modal/EditChat";
import {reloadTokenController} from "../../tools/reloadToken";
import {useHistory} from "react-router";

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

export default function Navbar() {
  const { dispatch, contacts } = useStoreon('contacts')
  const [showEditChat, setShowEditChat] = React.useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token', 'login']);
  const hid = contacts.active === 0 ? "hidden" : ""
  let history = useHistory();
  const signOut = async (e) => {
    e.preventDefault();
    let login = cookies.login
    let r = await reloadTokenController(setCookie, Controller().signOut,{login})
    if (r && r.data.code === 201){
      removeCookie('access_token');
      removeCookie('refresh_token');
      removeCookie('login');
      history.push("/signIn");
    }
  }
  const handleAddUser = (data) => {
    reloadTokenController(setCookie, Controller().addChatMember, contacts.active, data)
  }
  return (
    <>
      {/* Navbar */}
      <nav style={{height: "50px"}} className={" absolute top-0 left-0 w-full z-10 bg-white flex lg:flex-nowrap lg:justify-start items-center p-4"}>
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className={hid + " flex"}>
            <div className={"flex md:hidden mr-3"}>
              <i onClick={() => {
                dispatch("contacts/setActive", 0)
              }} className={"fa fa-arrow-left my-auto"}></i>
            </div>
            <div className={"cursor-pointer"} onClick={(e) => {
              e.preventDefault()
              setShowEditChat(true)
            }}>
              <div className="text-black text-sm uppercase font-semibold sm:max-w-150 overflow-ellipsis whitespace-nowrap">
                {contacts.activeData?.title}
              </div>
              <div className={"text-sm sm:max-w-150 overflow-ellipsis whitespace-nowrap"}>
                {getText(contacts.activeMembers?.count)}
              </div>
            </div>
          </div>
          <div className={hid ? "ml-auto" : ""}>
            <button onClick={signOut} className={"ml-auto mr-3 bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 ease-linear transition-all duration-150"}>Выйти</button>
          </div>
          {/* Form */}
          {/* User */}
        </div>
      </nav>
      {showEditChat ? <EditChatMW handleAddUser={handleAddUser} data={contacts.activeData} members={contacts.activeData.members} onHide={() => {setShowEditChat(false)}}/> : null}
      {/* End Navbar */}
    </>
  );
}
