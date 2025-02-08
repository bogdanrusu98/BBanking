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
import { toast } from 'react-toastify';
function Home() {
  const user = useUser();
  const [accounts, setAccounts] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [totalBalanceInRON, setTotalBalanceInRON] = useState(0);

  const API_KEY = 'fxr_live_276554b1eed5a8615cf0cca3641b748ae9ba';

  // Funcția de fetch pentru cursurile de schimb
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(`https://api.fxratesapi.com/latest?api_key=${API_KEY}&base=RON`);
      const data = await response.json();
      if (data.success) {
        setExchangeRates(data.rates);
      } else {
        console.error('Failed to fetch exchange rates:', data.error);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  // Se face fetch la cursurile de schimb la montarea componentului
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  // Se face fetch la conturi imediat ce avem user-ul
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsQuery = query(
          collection(db, 'accounts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(accountsQuery);
        const fetchedAccounts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('A apărut o eroare la preluarea conturilor.');
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

  // Calculează soldul total în RON ori de câte ori se schimbă conturile sau cursurile
  useEffect(() => {
    if (accounts.length > 0 && Object.keys(exchangeRates).length > 0) {
      const total = accounts.reduce((acc, account) => {
        // Asigură-te că valuta din cont este scrisă cu majuscule pentru a se potrivi cu cheile din exchangeRates
        const currency = account.currency.toUpperCase();

        // Dacă contul este în RON, nu e nevoie de conversie
        if (currency === 'RON') {
          return acc + account.balance;
        }

        const rate = exchangeRates[currency];
        if (rate) {
          // Pentru Cazul A: dacă API-ul returnează 1 RON = X valută, se face împărțirea
          const balanceInRON = account.balance / rate;
          // Dacă, în schimb, API-ul returnează 1 [currency] = X RON, folosește:
          // const balanceInRON = account.balance * rate;
          return acc + balanceInRON;
        } else {
          // Dacă nu găsește cursul pentru valuta respectivă, se adaugă direct (sau poți trata eroarea)
          console.warn(`Nu s-a găsit cursul pentru valuta: ${currency}`);
          return acc + account.balance;
        }
      }, 0);

      setTotalBalanceInRON(total);
    }
  }, [accounts, exchangeRates]);

  return (
    <div className=" dark:bg-gray-800 dark:text-white">
      <div className="rounded-lg ">
        {/* Total Balance Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Total balance</h2>
          <div className="text-3xl font-bold mt-2 flex items-center">
          {new Intl.NumberFormat('en-US').format(totalBalanceInRON.toFixed(2))} RON
            {/* <span className="ml-2 text-sm text-gray-500">
              <VscGraph className="logo-button text-2xl" />
            </span> */}
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
        <div className="mt-6 ">
          <div className="flex space-x-4 overflow-x-auto">
            {accounts.map((account, index) => (
              <Link to={`/balances/${account.id}`} key={index}>
                <div className="w-64 h-52 p-4 bg-gray-100 rounded-xl flex flex-col  dark:bg-gray-700">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      <CurrencyFlag currency={account.currency} size="xl" className="rounded-xl" />
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
              <div className="w-64 h-52 p-4 bg-white border-dashed  dark:bg-gray-700 border-2 border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
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
