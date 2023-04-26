import React from "react";
import PropTypes from "prop-types";
import {CreateChatMW} from "../Modal/CreateChat";
import AdminController from "../../controller/adminController";
import {CreateUserMW} from "../Modal/CreateUser";
import Controller from "../../controller/controller";
import {DeleteUserMW} from "../Modal/DeleteUser";
import {EditUserMW} from "../Modal/EditUser";
import {useStoreon} from "storeon/react";
import {reloadAdminTokenController} from "../../tools/reloadToken";
import {useCookies} from "react-cookie";

// components

export default function CardTable({ color }) {
  const [cookies, setCookie] = useCookies(['admin_access_token', 'login']);
  const [createUser, setCreateUser] = React.useState(false)
  const [deleteUser, setDeleteUser] = React.useState(false)
  const [editUser, setEditUser] = React.useState(false)
  const [state, setState] = React.useState({activeUser: {}})
  const { dispatch, admin } = useStoreon('admin')
  console.log(admin)
  const handleEdit = (e) => {
    return () => {
      console.log(e)
    }
  }
  const handleDelete = (e) => {
    return () => {
      console.log(e)
    }
  }
  const onDeleteUser = async () => {
    await reloadAdminTokenController(setCookie, AdminController().deleteUser, state.activeUser.id)
    await reloadAdminTokenController(setCookie, AdminController().getUsers)
    setState({...state, activeUser: {}})
  }
  const onCreateUser = async (data) => {
    await reloadAdminTokenController(setCookie, AdminController().createUser, data)
    await reloadAdminTokenController(setCookie, AdminController().getUsers)
  }
  const setActiveUser = async (data) => {
    let r = await reloadAdminTokenController(setCookie, AdminController().getUser, data.user.id)
    setState({...state, activeUser: r.Data})
  }
  const onEditUser = async (data) => {
    await reloadAdminTokenController(setCookie, AdminController().updateUser, data)
    await reloadAdminTokenController(setCookie, AdminController().getUsers)
    setState({...state, activeUser: {}})
  }
  return (
    <div className={"flex flex-col"}>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Пользователи
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Логин
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  IP
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Browser
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  ВРЕМЯ ВХОДА
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
            {admin.list.map((e, key) => {
              return <tr key={key}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                  <span
                      className={
                          "ml-3 font-bold " +
                          +(color === "light" ? "text-blueGray-600" : "text-white")
                      }
                  >
                    {e.user?.login}
                  </span>
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {e.ip}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {e.browser}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {e.authorization_at}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                  <i onClick={() => {
                    setActiveUser(e)
                    setEditUser(true)
                  }}  className={"fa fa-pen mr-3 cursor-pointer"}></i>
                  <i onClick={() => {
                    setActiveUser(e)
                    setDeleteUser(true)
                  }} className={"fa fa-trash mr-3 cursor-pointer"}></i>
                </td>
              </tr>
            })}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={() => setCreateUser(true)} className="ml-auto mr-3 bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
              type="button">
        <i className={"fa fa-plus-circle"}></i> Создать пользователя
      </button>
      {createUser ? <CreateUserMW onHide={() => setCreateUser(false)} onSubmit={(data) => {
        setCreateUser(false);
        onCreateUser(data);
      }}/> : null}
      {editUser ? <EditUserMW data={state.activeUser} onHide={() => setEditUser(false)} onSubmit={(data) => {
        onEditUser(data);
        setEditUser(false);
      }}/> : null}
      {deleteUser ? <DeleteUserMW onHide={() => setDeleteUser(false)} onSubmit={(data) => {
        onDeleteUser();
        setDeleteUser(false);
      }}/> : null}
    </div>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
