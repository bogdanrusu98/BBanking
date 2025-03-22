import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { IoSpeedometerOutline } from "react-icons/io5";
import { FaCcVisa } from "react-icons/fa6";

function Cards() {
  return (
    <div className="py-4">
      <div className="rounded-xl">
        {/* Header cu titlu și butoane */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold dark:text-white">Cards</h1>
          <div className="flex space-x-4">
            <button title='Edit limit' className="logo-active-button flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-green-500 transition">
              <IoSpeedometerOutline className="text-black text-xl" />
            </button>
            
            <Link to="/balances/add-money">
              <button title='Add money' className="logo-active-button flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-green-500 transition">
                <FaPlus className="text-black text-lg" />
              </button>
            </Link>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-2 dark:text-white">Your cards</h2>
        <div className="space-y-4">
          {/* Card nou */}
          <div className="flex items-center rounded-xl  dark:bg-gray-600 p-4 rounded-xl  hover:bg-gray-100 cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
              <FaPlus className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold dark:text-white">Order a new card</h3>
              <p className="text-gray-500 text-sm dark:text-white">Get another card for this account.</p>
            </div>
          </div>

          {/* Card digital */}
          <div className="flex items-center p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
            <FaCcVisa className="w-12 dark:text-white h-10 rounded-full flex items-center justify-center mr-4">
            </FaCcVisa>
            <div>
              <h3 className="font-semibold dark:text-white">Digital card •••• 8658</h3>
              <p className="text-gray-500 text-sm">Ready to use</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Is there anything we could do better? <Link to="/feedback" className="text-green-600 hover:underline">Give us feedback</Link>
        </p>
      </div>
    </div>
  );
}

export default Cards;
