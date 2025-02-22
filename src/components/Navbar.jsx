import React from 'react'
import { useEffect } from 'react'
import { initFlowbite } from 'flowbite';
import { Link } from 'react-router-dom';
import { FaPiggyBank } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BsFiles } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useUser } from '../hooks/userContext';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
function Navbar({ toggleSidebar }) {
  
  useEffect(() => {
    initFlowbite()
  }, [])
  
  const user = useUser()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    toast.success('Logged out');
    navigate('/');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setNotifications(fetchedNotifications); // actualizezi state-ul Notifications
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };

    fetchNotifications();
  }, [user.uid]);
  return (
    <header className="antialiased">
    <nav className="bg-white dark:text-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 m-4 pb-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 rounded-xl cursor-pointer lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
           
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
                <Link to="/" className="flex items-center mr-4 hidden sm:inline-flex ">
  <FaPiggyBank className="text-2xl logo" /> &nbsp;
  <span className="self-center text-2xl logo font-semibold whitespace-nowrap dark:text-white">BBANKING</span>
</Link>
                
              </div>
            <div className="flex items-center lg:order-2">
              
  
                <button type="button" data-dropdown-toggle="notification-dropdown" className="p-2 mr-1 text-gray-500 rounded-xl hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                    <span className="sr-only">View notifications</span>
  
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20"><path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/></svg>
                </button>
  
                <div className="hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700" id="notification-dropdown">
                    <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        Notifications
                    </div>

                  {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
  <div key={index}>
    <Link 
      to={notification.href} 
      className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
    >
      <div className="flex-shrink-0">
        <img 
          className="w-11 h-11 rounded-full" 
          src={notification.image || "data:image/png;base64,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"} 
          alt="Notification Avatar" 
        />
        <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
          <svg 
            className="w-2 h-2 text-white" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor" 
            viewBox="0 0 18 18"
          >
            <path d="M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z"/>
            <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z"/>
          </svg>
        </div>
      </div>

      <div className="pl-3 w-full">
        <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
          {notification.message}
        </div>
        <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
          a minute ago
        </div>
      </div>
    </Link>
  </div>
  ))
) : (
  <div className="py-3 px-4 text-center text-gray-500 dark:text-gray-400">
    Nu există notificări noi.
  </div>
)}
                  
                    <Link to="/notifications" className="block py-2 text-base font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline">
                        <div className="inline-flex items-center ">
                        <svg aria-hidden="true" className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                        View all
                        </div>
                    </Link>
                </div>
  
                <button type="button" className=" hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center mx-3 text-sm  rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
  <span className="sr-only">Open user menu</span>
  <img className="w-12 h-12 rounded-full" src={user.photoURL ? user.photoURL : "https://flowbite.com/docs/images/people/profile-picture-2.jpg"} alt="user" />
  <span className="hidden-xs hidden-sm hidden-md m-l-1 title-5 mx-2 font-semibold	">{user.firstName + ' ' + user.lastName}</span>
  <svg id="arrow" className="w-4 h-4 ml-1 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</button>
  
                <div className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown">
                    <div className="py-3 px-4">
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{user.firstName + ' ' + user.lastName}</span>
                        <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                    </div>
                    <ul className="py-2 text-gray-800 dark:text-gray-100" aria-labelledby="dropdown">
  <li>
    <Link to='/settings/profile/' className="flex items-center py-2 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-700">
      <CgProfile className="mr-3 text-xl" />
      <span>Personal details</span>
    </Link>
  </li>
  <li>
    <Link to="/statements" className="flex items-center py-2 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-700">
      <BsFiles className="mr-3 text-xl" />
      <span>Statements and reports</span>
    </Link>
  </li>
  <li>
    <Link to="/settings" className="flex items-center py-2 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-700">
      <IoSettingsOutline className="mr-3 text-xl" />
      <span>Settings</span>
    </Link>
  </li>
  <li>
    <Link to="/help" className="flex items-center py-2 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-700">
      <IoMdHelpCircleOutline className="mr-3 text-xl" />
      <span>Help</span>
    </Link>
  </li>
  <li>
    <button href="#" className="flex items-center py-2 px-4 text-base hover:bg-gray-50 dark:hover:bg-gray-700">
      <IoIosLogOut className="mr-3 text-xl" />
      <span onClick={handleLogout}>LogOut</span>
    </button>
  </li>
</ul>


                    
                </div>
            </div>
        </div>
    </nav>
  </header>
  )
}

export default Navbar