import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import CurrencyFlag from 'react-currency-flags';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertCurrency } from '../hooks/convertCurrency';
import { formatNumber } from '../hooks/formatNumber';

function SendMoney() {
  const user = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState('');
  const [recipientIban, setRecipientIban] = useState('');
  const [recipientAccount, setRecipientAccount] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null); // Rata de schimb
  const [convertedAmount, setConvertedAmount] = useState(null); // Suma convertită
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
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (user) fetchAccounts();
  }, [user]);

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    handleNextStep();
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleIbanChange = (e) => {
    setRecipientIban(e.target.value);
  };

  const handleValidateRecipient = async () => {
    try {
      const q = query(collection(db, 'accounts'), where('iban', '==', recipientIban));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const recipient = querySnapshot.docs[0].data();
        const recipientId = querySnapshot.docs[0].id; // Preluăm și ID-ul documentului
        setRecipientAccount({ ...recipient, id: recipientId });
        handleNextStep();
      } else {
        toast.error('No account found with the specified IBAN.');
      }
    } catch (error) {
      console.error('Error validating recipient:', error);
    }
  };

  const handleReview = async () => {
    try {
      // Calculează suma convertită și rata de schimb
      const converted = await convertCurrency(
        parseFloat(amount),
        selectedAccount.currency,
        recipientAccount.currency
      );
  
      if (converted === null) {
        toast.error('Error converting currency. Please try again.');
        return;
      }
  
      // Actualizează starea cu rata de schimb și suma convertită
      setExchangeRate(converted / parseFloat(amount)); // Rata de schimb
      setConvertedAmount(converted); // Suma convertită
  
      // Setează datele pentru revizuire
      setReviewData({
        account: selectedAccount,
        amount,
        recipient: recipientAccount,
      });
  
      // Treci la următorul pas
      handleNextStep();
    } catch (error) {
      console.error('Error during review:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handlePay = async () => {
    try {
      if (!selectedAccount || !selectedAccount.id || !recipientAccount || !recipientAccount.id) {
        console.error('Selected account or recipient account is invalid:', {
          selectedAccount,
          recipientAccount,
        });
        return;
      }

      // Verifică dacă soldul este suficient
      const newSenderBalance = selectedAccount.balance - parseFloat(amount);
      if (newSenderBalance < 0) {
        toast.error('Insufficient funds in the selected account.');
        return;
      }

      if (amount <= 0) {
        toast.error("Amount has to be higher than 0");
        return;
      }

      if (recipientIban === selectedAccount.iban) {
        toast.error('You cannot transfer to yourself');
        return;
      }

      // Conversia sumei în moneda destinatarului folosind funcția importată
      const convertedAmount = await convertCurrency(
        parseFloat(amount),
        selectedAccount.currency,
        recipientAccount.currency
      );

      if (convertedAmount === null) {
        toast.error('Error converting currency. Please try again.');
        return;
      }

      if(!user.name || !user.firstName || !user.lastName || !user.phoneNumber) {
        toast.error('You have to complete your profile details in order to send money');
        return;
      }

      const senderDocRef = doc(db, 'accounts', selectedAccount.id);
      const recipientDocRef = doc(db, 'accounts', recipientAccount.id);

      // Actualizează soldurile
      await updateDoc(senderDocRef, { balance: newSenderBalance });
      const newRecipientBalance = recipientAccount.balance + convertedAmount;
      await updateDoc(recipientDocRef, { balance: newRecipientBalance });

      // Determină tipul tranzacției
      const transactionType = recipientAccount.userId === selectedAccount.userId ? 'moved' : 'sent';

      // Adaugă tranzacția pentru expeditor
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
        currency: selectedAccount.currency,
        date: new Date(),
        type: transactionType,
        recipientIban: recipientAccount.iban,
        recipientId: recipientAccount.id,
      });

      // Adaugă tranzacția pentru destinatar (dacă e cazul)
      if (transactionType === 'sent') {
        await addDoc(collection(db, 'transactions'), {
          userId: recipientAccount.userId,
          accountId: recipientAccount.id,
          amount: convertedAmount,
          currency: recipientAccount.currency,
          date: new Date(),
          type: 'received',
          senderIban: selectedAccount.iban,
          senderId: selectedAccount.id,
        });
      }

      // Verifică dacă IBAN-ul există deja în colecția `recipients`
      const recipientRef = collection(db, 'recipients');
      const q = query(
        recipientRef,
        where('userId', '==', user.uid),
        where('iban', '==', recipientIban)
      );
      const querySnapshot = await getDocs(q);

      // Adaugă doar dacă IBAN-ul nu există deja
      if (querySnapshot.empty) {
        await addDoc(recipientRef, {
          userId: user.uid,
          createdAt: new Date(),
          iban: recipientIban,
          bankName: 'Auto',
          accountType: 'Private',
          accountHolderName: recipientAccount.name,
          currency: recipientAccount.currency,
          email: '',
        });
      } else {
        console.log('Recipient with this IBAN already exists. Skipping save.');
      }

      // Navighează la pagina principală
      navigate('/home');
    } catch (error) {
      console.error('Error completing the transaction:', error);
    }
  };


  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <ProgressBar currentStep={currentStep} />
        </div>
  
        {/* Step Content */}
        <div className="p-6">
          {/* Step 0: Choose Account */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Choose an account to pay from</h2>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => handleSelectAccount(account)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CurrencyFlag currency={account.currency} size="xl" className="rounded-xl" />
                        <div className="ml-4">
                          <p className="font-semibold text-gray-800 dark:text-white">{account.currency}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">IBAN: ..{account.iban.slice(-4)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-800 dark:text-white">
                        {formatNumber(account.balance)} {account.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {/* Step 1: Enter Recipient's IBAN */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Enter recipient's IBAN</h2>
              <input
                type="text"
                value={recipientIban}
                onChange={handleIbanChange}
                placeholder="Enter recipient's IBAN"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-8 bg-gray-200 dark:bg-gray-600 border-0" />
                </div>
                <div className="space-y-2">
                  {accounts
                    .filter((account) => account.id !== selectedAccount?.id)
                    .map((account) => (
                      <div
                        key={account.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => setRecipientIban(account.iban)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CurrencyFlag currency={account.currency} size="xl" className="rounded-xl" />
                            <div className="ml-4">
                              <p className="font-semibold text-gray-800 dark:text-white">{account.currency}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">IBAN: ..{account.iban.slice(-4)}</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-800 dark:text-white">
                            {formatNumber(account.balance)} {account.currency}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleValidateRecipient}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
  
          {/* Step 2: Enter Amount */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Enter amount</h2>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReview}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
  
          {/* Step 3: Review Transaction */}
          {currentStep === 3 && reviewData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Review your transaction</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">From:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {reviewData.account.currency} - ..{reviewData.account.iban.slice(-4)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Balance: {formatNumber(reviewData.account.balance)} {reviewData.account.currency}
                  </p>
                </div>
  
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">To:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {reviewData.recipient.currency} - ..{reviewData.recipient.iban.slice(-4)}
                  </p>
                </div>
  
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="font-semibold text-gray-800 dark:text-white">Amount:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    You will pay: {formatNumber(parseFloat(amount))} {reviewData.account.currency}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Recipient will receive: {formatNumber(convertedAmount)} {reviewData.recipient.currency}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exchange rate: 1 {reviewData.account.currency} = {formatNumber(exchangeRate, 4)} {reviewData.recipient.currency}
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
  
          {/* Step 4: Complete Payment */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Complete payment</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Press "Pay" to complete the transaction.</p>
              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePay}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendMoney;
