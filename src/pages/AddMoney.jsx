import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/userContext';
import { FaCcVisa } from 'react-icons/fa';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddMoney() {
  const user = useUser();
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('');
  const [cardNumber, setCardNumber] = useState('0000');
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fees, setFees] = useState({
    cardFee: 0.35,
    serviceFee: 0.0,
  });

  const totalFees = fees.cardFee + fees.serviceFee;
  const totalAmount = amount + totalFees;
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const q = query(
          collection(db, 'accounts'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedAccounts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const handleAmountChange = (e) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currency) {
      toast.error('Please select a currency.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verifică dacă există deja un cont cu valuta selectată
      const existingAccount = accounts.find((account) => account.currency === currency);

      let accountId;
      let newBalance;

      if (existingAccount) {
        // Dacă contul există, actualizăm soldul
        accountId = existingAccount.id;
        newBalance = existingAccount.balance + amount;

        await updateDoc(doc(db, 'accounts', accountId), {
          balance: newBalance,
        });

        toast.success(`Added ${amount} ${currency} to your ${currency} account.`);
        navigate('/home')
      } else {
        // Dacă contul nu există, creăm unul nou
        const newAccountRef = await addDoc(collection(db, 'accounts'), {
          userId: user.uid,
          currency: currency,
          balance: amount,
          createdAt: new Date(),
        });

        accountId = newAccountRef.id;
        newBalance = amount;

        toast.success(`New ${currency} account created with ${amount} ${currency}.`);
      }

      // Adăugăm înregistrarea tranzacției în `transactions`
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        accountId: accountId,
        type: 'deposit',
        amount: amount,
        currency: currency,
        date: new Date(),
        cardNumber: `*${cardNumber}`,
        fees: totalFees,
        totalAmount: totalAmount,
      });

      // Resetare formular
      setCurrency('');
      setAmount(100);

    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:ml-64">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Add money</h2>

        {/* Input for amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount to add</label>
          <div className="flex items-center mt-1">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-r-md">
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="bg-transparent focus:outline-none"
              >
                <option value="">Choose currency...</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.currency}>
                    {account.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">You can open balances in 40+ currencies.</p>
        </div>

        {/* Payment method */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-700">Paying with</h3>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg mt-2">
            <FaCcVisa className="text-blue-500 w-10 h-10" />
            <div className="ml-4">
              <p className="font-medium">Debit card *{cardNumber}</p>
              <p className="text-gray-500">RON • Expires 00/20</p>
            </div>
            <button className="ml-auto text-green-600 hover:underline">Change</button>
          </div>
        </div>

        {/* Fees section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Debit card fee</span>
            <span className="text-gray-700">{fees.cardFee.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Our fee</span>
            <span className="text-gray-700">{fees.serviceFee.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-700 font-medium">Total fees</span>
            <span className="text-gray-700 font-medium">{totalFees.toFixed(2)} RON</span>
          </div>
          <div className="flex justify-between mt-4 font-bold">
            <span>Total you'll pay</span>
            <span>{totalAmount.toFixed(2)} RON</span>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default AddMoney;
