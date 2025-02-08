import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { useUser } from '../hooks/userContext';
import { db } from '../firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const StatementsPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const user = useUser();
  const [transactions, setTransactions] = useState([]);

  // Funcția pentru preluarea tranzacțiilor din Firebase
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedTransactions = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.seconds * 1000 // Transformă timestamp-ul într-un timestamp normal JavaScript
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

  // Calculează totalurile pe baza tranzacțiilor preluate
  const totalIncome = transactions.reduce((sum, item) => {
    if (item.type === 'received' || item.type === 'deposit') {  // Verifică dacă este venit sau depunere
      return sum + item.amount;
    }
    return sum;
  }, 0);

  const totalExpenses = transactions.reduce((sum, item) => {
    if (item.type === 'sent') {  // Verifică dacă este o cheltuială
      return sum + item.amount;
    }
    return sum;
  }, 0);

  const netProfit = totalIncome - totalExpenses;

  // Grupa tranzacțiile pe luni pentru a le afișa în grafic
  const transactionData = transactions.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('en-us', { month: 'short' }); // Transformă data într-o lună
    const index = acc.findIndex((item) => item.month === month);

    if (index === -1) {
      acc.push({
        month,
        income: (curr.type === 'received' || curr.type === 'deposit') ? curr.amount : 0,  // Include 'deposit' ca venit
        expenses: curr.type === 'sent' ? curr.amount : 0,
      });
    } else {
      if (curr.type === 'received' || curr.type === 'deposit') {
        acc[index].income += curr.amount;
      } else if (curr.type === 'sent') {
        acc[index].expenses += curr.amount;
      }
    }

    return acc;
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-400">Reports</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-xl dark:bg-gray-800 dark:text-gray-400"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Statistici rapide */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-xl">
          <h3 className="text-lg text-green-600">Total Income</h3>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US').format(totalIncome.toFixed(2))} RON</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl">
          <h3 className="text-lg text-red-600">Total Expenses</h3>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US').format(totalExpenses.toFixed(2))} RON</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl">
          <h3 className="text-lg text-blue-600">Profit Net</h3>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {new Intl.NumberFormat('en-US').format(netProfit.toFixed(2))} RON
          </p>
        </div>
      </div>

      {/* Grafic principal */}
      <div className="bg-white p-6 rounded-xl dark:bg-gray-700  shadow-lg">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Profit Net"
              dot={{ fill: '#3b82f6' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatementsPage;
