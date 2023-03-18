import React from "react";

import {useStoreon} from "storeon/react";

export default function Navbar() {
  const { dispatch, contacts } = useStoreon('contacts')
  const hid = contacts.active === 0 ? "hidden" : ""
  return (
    <>
      {/* Navbar */}
      <nav style={{height: "50px"}} className={hid + " absolute top-0 left-0 w-full z-10 bg-white flex lg:flex-nowrap lg:justify-start items-center p-4"}>
        <div className="w-full mx-auto items-center flex md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <div className={"flex md:hidden mr-3"}>
            <i onClick={() => {
              dispatch("contacts/setActive", 0)
            }} className={"fa fa-arrow-left"}></i>
          </div>
          <a
            className="text-black text-sm uppercase font-semibold"
            onClick={(e) => e.preventDefault()}
          >
            {contacts.list.filter(e => e.id === contacts.active)[0]?.name}
          </a>
          {/* Form */}
          {/* User */}
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
