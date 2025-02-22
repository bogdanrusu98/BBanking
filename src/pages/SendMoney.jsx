import React, { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import CurrencyFlag from 'react-currency-flags';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
          alert('No account found with the specified IBAN.');
        }
      } catch (error) {
        console.error('Error validating recipient:', error);
      }
    };
  
    const handleReview = () => {
      setReviewData({
        account: selectedAccount,
        amount,
        recipient: recipientAccount,
      });
      handleNextStep();
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

        if(amount < 0) {
          toast.error("Amount has to be positive");
          return;
        }
    
        const senderDocRef = doc(db, 'accounts', selectedAccount.id);
        const recipientDocRef = doc(db, 'accounts', recipientAccount.id);
    
        // Actualizează soldurile
        await updateDoc(senderDocRef, { balance: newSenderBalance });
        const newRecipientBalance = recipientAccount.balance + parseFloat(amount);
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
            amount: parseFloat(amount),
            currency: selectedAccount.currency,
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
    <div className="p-6">
      <div className="max-w-2xl mx-auto  dark:bg-gray-700 dark:text-gray-400 shadow-md bg-white p-6 rounded-xl shadow-md">
        <ProgressBar currentStep={currentStep} />

        {currentStep === 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Choose an account to pay from</h2>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 bg-gray-100 rounded-xl  dark:bg-gray-600  flex items-center justify-between cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectAccount(account)}
                >
                  <div className="flex items-center">
                    <CurrencyFlag currency={account.currency} size="xl" className="rounded-xl" />
                    <div className="ml-4">
                      <p className="font-semibold">{account.currency}</p>
                      <p className="text-sm text-gray-500">IBAN: ..{account.iban.slice(-4)}</p>
                    </div>
                  </div>
                  <p className="font-bold">{account.balance.toFixed(2)} {account.currency}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Enter recipient's IBAN</h2>
            <input
              type="text"
              value={recipientIban}
              onChange={handleIbanChange}
              placeholder="Enter recipient's IBAN"
              className="w-full px-4 py-2 border rounded-xl mb-4 dark:bg-gray-700"
            />
            <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-200 rounded-xl mr-2 dark:bg-gray-700">Back</button>
            <button onClick={handleValidateRecipient} className="px-4 py-2 bg-green-500 text-white rounded-xl">Next</button>
          </div>
        )}
                {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Enter amount</h2>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border rounded-xl mb-4 dark:bg-gray-700"
            />
            <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-200 rounded-xl mr-2 dark:bg-gray-700">Back</button>
            <button onClick={handleReview} className="px-4 py-2 bg-green-500 text-white rounded-xl">Next</button>
          </div>
        )}

        {currentStep === 3 && reviewData && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Review your transaction</h2>
            <div className="mb-4">
              <p>From: {reviewData.account.currency} - ..{reviewData.account.iban.slice(-4)}</p>
              <p>To: {reviewData.recipient.currency} - ..{reviewData.recipient.iban.slice(-4)}</p>
              <p>Amount: {amount} {reviewData.account.currency}</p>
            </div>
            <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-200 rounded-xl mr-2 dark:bg-gray-700">Back</button>
            <button onClick={handleNextStep} className="px-4 py-2 bg-green-500 text-white rounded-xl">Confirm</button>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Complete payment</h2>
            <p className="mb-4">Press "Pay" to complete the transaction.</p>
            <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-200 rounded-xl mr-2 dark:bg-gray-700">Back</button>
            <button onClick={handlePay} className="px-4 py-2 bg-green-500 text-white rounded-xl">Pay</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendMoney;
