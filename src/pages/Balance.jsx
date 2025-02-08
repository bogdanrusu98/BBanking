import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useParams } from 'react-router-dom';

function Balance() {
  const { accountId } = useParams(); // Preia `accountId` din URL
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 bg-gray-50 dark:text-white  dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Balance Details</h2>
        {loading ? (
          <p>Loading account details...</p>
        ) : account ? (
          <div>
            <p><strong>IBAN:</strong> {account.iban}</p>
            <p><strong>Balance:</strong> {account.balance.toFixed(2)} {account.currency}</p>
            {/* Afișează alte informații despre cont, dacă este necesar */}
          </div>
        ) : (
          <p>No account found.</p>
        )}
      </div>
    </div>
  );
}

export default Balance;
