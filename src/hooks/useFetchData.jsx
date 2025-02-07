import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
const useFetchData = (collectionName, conditions = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let q = collection(db, collectionName);

        if (conditions.length > 0) {
          q = query(q, ...conditions.map(cond => where(cond.field, cond.operator, cond.value)));
        }

        const snapshot = await getDocs(q);
        const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(result);
      } catch (err) {
        console.error(`Error fetching data from ${collectionName}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(conditions)]); // Reapelează dacă se schimbă condițiile

  return { data, loading, error };
};

export default useFetchData;
