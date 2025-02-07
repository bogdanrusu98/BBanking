import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/userContext';
import { FaRegArrowAltCircleUp, FaLandmark, FaRegArrowAltCircleDown, FaExchangeAlt } from 'react-icons/fa';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
function Transactions() {

    const user = useUser();
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const fetchedTransactions = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Formatează suma cu virgule ca separator de mii
            if (data.amount) {
              data.amount = new Intl.NumberFormat('en-US').format(data.amount);
            }
            return {
              id: doc.id,
              ...data,
            };
          });
          setTransactions(fetchedTransactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
    
      if (user) {
        fetchTransactions();
      }
    }, [user]);

  return (
    <>

     <div className="mt-10">
     <div className="flex justify-between items-center mb-4">
       <h2 className="text-2xl font-semibold">Transactions</h2>
       <Link to="/all-transactions" className="text-green-600 hover:underline">See all</Link>
     </div>
     <div className="space-y-4">
       {transactions.map((transaction, index) => (
         <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
           <div className="text-gray-500">
           {(transaction.type === 'received' || transaction.type === 'deposit') && (
<FaRegArrowAltCircleDown className="text-green-500 w-6 h-6" />
)}

             {transaction.type === 'sent' && <FaRegArrowAltCircleUp className="text-red-500 w-6 h-6" />}
             {transaction.type === 'moved' && <FaExchangeAlt className="text-blue-500 w-6 h-6" />}
           </div>
           <div className="flex-1">
<h3 className="font-semibold">{transaction.type}</h3>
<p className="text-sm text-gray-500">
{transaction.date?.toDate
? transaction.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
</p>


</div>
<div className={`font-bold ${
transaction.type === 'received' || transaction.type === 'deposit'
? 'text-green-600'
: transaction.type === 'sent'
? 'text-red-500'
: 'text-gray-800'
}`}>

             {transaction.amount} {transaction.currency}
           </div>
         </div>
       ))}
     </div>
   </div>

</>
  )
}

export default Transactions