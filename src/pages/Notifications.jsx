import { useState, useEffect } from 'react';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
function Notifications() {
  const user = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) return;
  
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
  
        const fetchedNotifications = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          let date;
  
          if (data.timestamp?.seconds) {
            const dateObj = new Date(data.timestamp.seconds * 1000);
            // Assign to outer 'date' variable
            date = dateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            });
          } else {
            date = 'No date';
          }
  console.log(data)
          return {
            id: doc.id,
            ...data,
            date,
          };
        });
  
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    fetchNotifications();
  }, [user]);
  return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-3xl dark:text-gray-400 font-bold mb-6">Inbox Notifications ({notifications.length})</h1>
    <div className="space-y-6">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Link to={notification.href}>
          <div key={notification.id} className="border rounded-xl dark:hover:bg-gray-600 p-4 shadow-lg bg-white dark:bg-gray-800 flex items-center space-x-4">
            <img
              src={notification.senderProfilePic || 'data:image/png;base64,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'}
              alt={notification.senderId}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{notification.subject}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                From: {notification.senderId} | Date: {notification.date}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{notification.message}</p>
            </div>
          </div>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No notifications found.</p>
      )}
    </div>
  </div>
  
  );
}

export default Notifications;
