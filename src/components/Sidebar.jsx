import React from 'react'
import { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import { PiHouseLineLight } from "react-icons/pi";
import { CiCreditCard1 } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { RiCurrencyLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function Sidebar() {
    useEffect(() => {
        initFlowbite()
      }, [])
    
  return (
    <>


      <aside id="logo-sidebarr" className="fixed z-40 w-64 h-screen transition-transform -translate-x-full bg-white  sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="logo-sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
  <li>
    <Link to="/home" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group">
      <PiHouseLineLight className="text-xl text-gray-500 group-hover:text-blue-500 dark:group-hover:text-white" />
      <span className="ml-3 text-base">Home</span>
    </Link>
  </li>
  <li>
    <Link to="/cards" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group">
      <CiCreditCard1 className="text-xl text-gray-500 group-hover:text-blue-500 dark:group-hover:text-white" />
      <span className="ml-3 text-base">Card</span>
    </Link>
  </li>
  <li>
    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group">
      <IoPeopleOutline className="text-xl text-gray-500 group-hover:text-blue-500 dark:group-hover:text-white" />
      <span className="ml-3 text-base">Recipients</span>
    </a>
  </li>
  <li>
    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 group">
      <RiCurrencyLine className="text-xl text-gray-500 group-hover:text-blue-500 dark:group-hover:text-white" />
      <span className="ml-3 text-base">Payments</span>
    </a>
  </li>
</ul>

   </div>
</aside>

   

</>
  )
}

export default Sidebar