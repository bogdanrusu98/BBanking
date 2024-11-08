import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/userContext';
import { CiCirclePlus } from 'react-icons/ci';
import { FaLandmark } from 'react-icons/fa';
import { VscGraph } from 'react-icons/vsc';
import { db } from '../firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import CurrencyFlag from 'react-currency-flags';
import Transactions from '../components/Transactions';

function Home() {
  const user = useUser();
  const [accounts, setAccounts] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [totalBalanceInRON, setTotalBalanceInRON] = useState(0);

  // API Key pentru FXRatesAPI
  const API_KEY = 'fxr_live_276554b1eed5a8615cf0cca3641b748ae9ba'; // Înlocuiește cu cheia ta API

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(`https://api.fxratesapi.com/latest?api_key=${API_KEY}&base=RON`);
      const data = await response.json();
      if (data.success) {
        setExchangeRates(data.rates);
        console.log('Exchange rates:', data.rates);
      } else {
        console.error('Failed to fetch exchange rates:', data.error);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const q = query(collection(db, 'accounts'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedAccounts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(fetchedAccounts);

        // Calculează soldul total în RON
        if (fetchedAccounts.length > 0 && Object.keys(exchangeRates).length > 0) {
          const total = fetchedAccounts.reduce((acc, account) => {
            const rate = exchangeRates[account.currency] || 1; // Folosește rata de schimb sau 1 dacă este RON
            return acc + (account.balance / rate); // Împarte la rata pentru a obține valoarea în RON
          }, 0);
          console.log('Total in RON:', total);
          setTotalBalanceInRON(total);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (user && Object.keys(exchangeRates).length > 0) {
      fetchAccounts();
    }
  }, [user, exchangeRates]);
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 rounded-lg ">
        {/* Total Balance Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Total balance</h2>
          <div className="text-3xl font-bold mt-2 flex items-center">
            {totalBalanceInRON.toFixed(2)} RON
            <span className="ml-2 text-sm text-gray-500">
              <VscGraph className="logo-button text-2xl" />
            </span>
          </div>
          <div className="flex mt-4 space-x-4">
            <Link to="/balances/send-money">
              <button className="px-4 py-2 logo-active-button rounded-full">Send</button>
            </Link>
            <Link to="/balances/add-money">
              <button className="px-4 py-2 bg-gray-200 logo-button rounded-full">Add money</button>
            </Link>
            <button className="px-4 py-2 bg-gray-200 logo-button rounded-full">Request</button>
          </div>
        </div>

        {/* Accounts Section */}
        <div className="mt-6">
          <div className="flex space-x-4 overflow-x-auto">
            {accounts.map((account, index) => (
              <Link to={`/balances/${account.id}`} key={index}>
                <div className="w-64 h-52 p-4 bg-gray-100 rounded-xl flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      <CurrencyFlag currency={account.currency} size="xl" className="rounded-lg" />
                    </span>
                    <h3 className="font-semibold text-lg">{account.currency}</h3>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FaLandmark className="mr-1" />
                    <span className="ml-1">.. {account.iban.slice(-4)}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {account.balance.toFixed(2)}
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/open-balance">
              <div className="w-64 h-52 p-4 bg-white border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                <CiCirclePlus className="w-10 h-10 text-gray-500" />
                <p className="font-semibold pt-4 text-center">
                  {accounts.length > 0 ? 'Add another currency to your account.' : 'Open an account'}
                </p>
              </div>
            </Link>
          </div>
        </div>
        <Transactions />
      </div>
    </div>
  );
}

export default Home;
