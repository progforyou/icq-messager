/*eslint-disable*/
import React from "react";
import {NavLink} from "react-router-dom";
import MD5 from "crypto-js/md5";
import {useStoreon} from "storeon/react";
import {CreateChatMW} from "../Modal/CreateChat";
import Controller from "../../controller/controller";
import {useCookies} from "react-cookie";
import {reloadTokenController} from "../../tools/reloadToken";


export const getColorIdentity = (contactName) => {
  const hc = hashCodeIdentity(contactName) % 360;
  return `hsl(${hc}, 63%, 60%)`
}

const hashCodeIdentity = (s) => {
  s = MD5(s).toString()
  let h = 0, l = s.length, i = 0;
  if (l > 0)
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
};

const ChatItem = ({contacts, dispatch, e}) => {
  const itemName = e.id === -1 ? <i className={"fa fa-star"}></i> : e.title[0]
  const onClick = () => {
    dispatch("contacts/setActive", e.id)
  }
  if (contacts.active === e.id){
    return <div className={"px-3 flex text-white items-center cursor-pointer uppercase py-3 font-bold block bg-lightBlue-500 hover:bg-lightBlue-600"}>
      <div className={"w-10 h-10 mr-2 rounded-full flex"} style={{backgroundColor: getColorIdentity(e.title)}}>
        <span className={"m-auto"}>
          {itemName}
        </span>
      </div>
      <div className={"text-xs"}>
        {e.title}
      </div>
    </div>
  }
  return  <div onClick={onClick} className={"px-3 flex text-black items-center cursor-pointer uppercase py-3 font-bold block bg-transparent hover:bg-blueGray-200"}>
    <div className={"w-10 h-10 mr-2 rounded-full flex"} style={{backgroundColor: getColorIdentity(e.title)}}>
        <span className={"m-auto"}>
          {itemName}
        </span>
    </div>
    <div className={"text-xs"}>
      {e.title}
    </div>
  </div>
}

function Sidebar(props) {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [createChat, setCreateChat] = React.useState(false);
  const { dispatch, contacts } = useStoreon('contacts')
  const classNames = ""
  return (
    <>
      <nav className="hidden md:flex md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Brand */}
          <div className={"flex items-center justify-between"}>
            <div className="px-3 md:flex text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
              Чаты
            </div>
            <div>
              <button onClick={() => setCreateChat(true)} className={"ml-auto mr-3 bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 ease-linear transition-all duration-150"}>Создать</button>
            </div>
          </div>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Form */}
            <form className="mb-4 px-3">
              <div className="pt-0">
                <input
                  type="text"
                  placeholder="Поиск"
                  className="focus:shadow-none border-0 px-3 py-2 h-8 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            <ul className="h-full md:flex-col md:min-w-full flex flex-col list-none">

              {contacts.list.map((e, key) => {
                return (
                    <div key={key}>
                      <ChatItem contacts={contacts} e={e} dispatch={dispatch}/>
                    </div>
                )
              })}
            </ul>

           {/* <div className={"mt-auto"}>
              <hr className="my-2 md:min-w-full" />
              <ul className="px-6 mt-auto md:min-w-full flex justify-between list-none">
                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/wqe"
                  >
                    <i className="fas fa-fingerprint mx-auto text-xl"></i>{" "}
                    Контакты
                  </NavLink>
                </li>

                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/chat"
                  >
                    <i className="fas fa-clipboard-list mx-auto text-xl"></i>{" "}
                    Чаты
                  </NavLink>
                </li>
                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/notes"
                  >
                    <i className="fas mx-auto fa-cog  text-xl"></i>{" "}
                    Заметки
                  </NavLink>
                </li>
              </ul>
            </div>*/}
            
          </div>
        </div>
      </nav>
      {createChat ? <CreateChatMW onHide={() => setCreateChat(false)} onSubmit={(data) => {
        props.onSubmit(data);
        setCreateChat(false)
      }}/> : null}
    </>
  );
}

function MobileSidebar(props) {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [createChat, setCreateChat] = React.useState(false);
  const { dispatch, contacts } = useStoreon('contacts')
  const classNames = ""
  if (contacts.active !== 0){
    return  null
  }
  return (
      <>
        <nav style={{height: "100vh", alignItems: "start"}} className="flex left-0 block fixed top-0 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white flex flex-wrap justify-between relative w-64 z-10 py-4">
          <div className="flex-col items-stretch min-h-full flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
            {/* Brand */}
            <div className={"flex items-center justify-between"}>
              <div className="px-3 md:flex text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
                Чаты
              </div>
              <div>
                <button onClick={() => setCreateChat(true)} className={"ml-auto mr-3 bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 ease-linear transition-all duration-150"}>Создать</button>
              </div>
            </div>
            {/* Collapse */}
              {/* Form */}
              <form className="mb-4 px-3">
                <div className="pt-0">
                  <input
                      type="text"
                      placeholder="Поиск"
                      className="focus:shadow-none border-0 px-3 py-2 h-8 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                  />
                </div>
              </form>

              <ul className="h-full md:flex-col md:min-w-full flex flex-col list-none">

                {contacts.list.map((e, key) => {
                  return (
                      <div key={key}>
                        <ChatItem contacts={contacts} e={e} dispatch={dispatch}/>
                      </div>
                  )
                })}
              </ul>

              {/* <div className={"mt-auto"}>
              <hr className="my-2 md:min-w-full" />
              <ul className="px-6 mt-auto md:min-w-full flex justify-between list-none">
                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/wqe"
                  >
                    <i className="fas fa-fingerprint mx-auto text-xl"></i>{" "}
                    Контакты
                  </NavLink>
                </li>

                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/chat"
                  >
                    <i className="fas fa-clipboard-list mx-auto text-xl"></i>{" "}
                    Чаты
                  </NavLink>
                </li>
                <li className="items-center">
                  <NavLink
                      className="text-blueGray-700 flex flex-col text-xs pt-3 font-bold block"
                      activeClassName="!text-lightBlue-500 "
                      to="/notes"
                  >
                    <i className="fas mx-auto fa-cog  text-xl"></i>{" "}
                    Заметки
                  </NavLink>
                </li>
              </ul>
            </div>*/}

            </div>
        </nav>
        {createChat ? <CreateChatMW onHide={() => setCreateChat(false)} onSubmit={(data) => {
          props.onSubmit(data);
          setCreateChat(false)
        }}/> : null}
      </>
  );
}

export default (props) => {
  const { dispatch, customize } = useStoreon('customize')
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token', 'login']);
  const createChat = async (data) => {
    let r = await reloadTokenController(setCookie, Controller().createChat, data)
    
    if (r.status === 200){
      dispatch("contacts/addChat", r.data.data)
      dispatch("contacts/setActive", r.data.data.id)
    }
  }
  if (customize.isMobile) {
    return <MobileSidebar onSubmit={createChat} {...props}/>
  }
  return <Sidebar onSubmit={createChat} {...props}/>
}

