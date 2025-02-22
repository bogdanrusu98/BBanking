import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useUser } from '../hooks/userContext';
import { FiSearch } from 'react-icons/fi';

const AllTransactions = ({ currency = null }) => {
  const user = useUser();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Construiește query-ul în funcție de currency
        let q;
        if (currency) {
          q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid),
            where('currency', '==', currency)
          );
        } else {
          q = query(
            collection(db, 'transactions'),
            where('userId', '==', user.uid)
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedTransactions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user, currency]); // Adaugă currency ca dependență

  const groupByDate = (transactions) => {
    return transactions.reduce((acc, txn) => {
      const timestamp = txn.date; // presupunem că txn.date este un obiect cu seconds și nanoseconds
      const dateObj = new Date(timestamp.seconds * 1000); // conversia în Date
      const date = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      if (!acc[date]) acc[date] = [];
      acc[date].push(txn);
      return acc;
    }, {});
  };

  const sortedTransactions = [...transactions].sort((a, b) => b.date.seconds - a.date.seconds);
  const groupedTransactions = groupByDate(sortedTransactions);

  return (
    <div className="">
      <div className="flex items-center justify-between dark:text-gray-400 mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>

      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-10 border rounded-full dark:bg-gray-800 dark:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {(transactions.length > 0) ? Object.entries(groupedTransactions).map(([date, txns]) => (
        <div key={date} className="mb-6">
          <h2 className="text-gray-500 dark:text-gray-400 font-semibold mb-2">{date}</h2>
          {txns.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-4 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  {txn.type === 'sent' ? '⬆️' : txn.type === 'received' ? '⬇️' : txn.type === 'deposit' ? '💰' : '↔️'}
                </div>
                <div>
                  <p className="font-medium">{txn.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300 font-semibold">
                    {txn.type === 'sent'
                      ? 'Sent'
                      : txn.type === 'received'
                        ? 'Received'
                        : txn.type === 'deposit'
                          ? 'Deposit'
                          : txn.type === 'moved'
                            ? 'Moved'
                            : 'Error'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${txn.type === 'received' || txn.type === 'deposit'
                      ? 'text-green-500'
                      : txn.type === 'sent'
                        ? 'text-red-500'
                        : txn.type === 'moved'
                          ? 'text-black dark:text-gray-300'
                          : 'text-gray-500'
                    }`}
                >
                  {txn.type === 'received' || txn.type === 'deposit'
                    ? `+${txn.amount.toLocaleString()}`
                    : txn.type === 'sent'
                      ? `-${txn.amount.toLocaleString()}`
                      : txn.amount.toLocaleString()}{' '}
                  {txn.currency}
                </p>
                {txn.convertedAmount && (
                  <p className="text-sm text-gray-400">
                    {txn.convertedAmount.toLocaleString()} RON
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )) : 'No transactions found for this currency'}
    </div>
  );
};

export default AllTransactions;