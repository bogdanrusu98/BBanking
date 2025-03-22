import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useParams } from 'react-router-dom';
import CurrencyFlag from 'react-currency-flags';
import { FaLandmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AllTransactions from '../pages/AllTransactions';


function Balance() {
  const { accountId } = useParams(); // Preia `accountId` din URL
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false); // Stare pentru gestionarea copierii

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        // Creează referința către documentul specific al contului
        const docRef = doc(db, 'accounts', accountId);
        const docSnap = await getDoc(docRef);

        // Verifică dacă documentul există și setează datele în `account`
        if (docSnap.exists()) {
          const fetchedAccount = {
            id: docSnap.id,
            ...docSnap.data(),
          };
          setAccount(fetchedAccount);
        } else {
          console.error('No account found with the specified ID.');
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  // Funcție pentru copierea IBAN-ului în clipboard
  const handleCopy = () => {
    if (account?.iban) {
      navigator.clipboard.writeText(account.iban).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 4000); // Resetează starea după 2 secunde
      });
    }
  };

  return (
    <div className="p-4">
      <div className="p-4 bg-gray-50 dark:text-white dark:bg-gray-800 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Balance Details</h2>
        {loading ? (
          <p>Loading account details...</p>
        ) : account ? (
          <div className="w-full h-auto p-4 bg-gray-100 rounded-xl flex flex-col dark:bg-gray-700">
  {/* Header cu steag și monedă */}
  <div className="flex items-center mb-2">
    <span className="text-2xl mr-2">
      <CurrencyFlag currency={account.currency} width={78} className="rounded-xl" />
    </span>
    <h3 className="font-normal text-lg">{account.currency} balance</h3>
  </div>

  {/* Balanța contului și butoanele */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
    {/* Valoarea balanței */}
    <div className="text-3xl font-semibold">
      {new Intl.NumberFormat('en-US').format(account.balance.toFixed(2))} {account.currency}
    </div>

    {/* Butoanele */}
    <div className="lg:flex space-x-4 mt-4 md:mt-0">
      <Link to="/balances/send-money">
        <button className="px-4 py-2 logo-active-button rounded-full">Send</button>
      </Link>
      <Link to="/balances/add-money">
        <button className="px-4 py-2 logo-active-button logo-button rounded-full">Add money</button>
      </Link>
      <button className="px-4 py-2 logo-active-button logo-button rounded-full">Request</button>
    </div>
  </div>

  {/* IBAN cu buton de copiere */}
  <div className="flex mt-4 items-center bg-gray-200 dark:text-gray-500 text-sm mb-2 p-4 dark:bg-gray-600 w-full rounded-xl dark:text-white relative">
    <FaLandmark className="mr-1" />
    <span className="ml-1 font-semibold">{account.iban}</span>
        

              {/* Buton de copiere */}
                <button
                  onClick={handleCopy}
                  className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 inline-flex items-center justify-center"
                >
                  {isCopied ? (
                    <svg
                      className="w-3.5 h-3.5 text-green-700 dark:text-green-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                  )}
                </button>
            </div>

            <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-600" />


            <div className="">
            <AllTransactions currency={account.currency} />
            </div>

          </div>
        ) : (
          <p>No account found.</p>
        )}
      </div>
    </div>
  );
}

export default Balance;