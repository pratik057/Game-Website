"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";
import Logo from "../assets/logo.png"; // Import your logo
const WalletControls = ({ onClose }) => {
  const { user, balance, updateBalance } = useContext(UserContext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [activeTab, setActiveTab] = useState("deposit");
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (balance !== displayBalance) {
      const interval = setInterval(() => {
        setDisplayBalance(prev => {
          const diff = balance - prev;
          const increment = diff > 0 ? Math.max(1, Math.ceil(diff / 10)) : Math.min(-1, Math.floor(diff / 10));
          if (Math.abs(diff) < Math.abs(increment)) {
            clearInterval(interval);
            return balance;
          }
          return prev + increment;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [balance, displayBalance]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(`https://game-website-yyuo.onrender.com/api/games/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        showNotification("Failed to load transactions", "error");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showNotification("Could not fetch transactions", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

 const handleDeposit = () => {
  const message = `UserId: ${user.id}\nName: ${user.username}\nEmail: ${user.email}\nAmount to deposit: ${amount}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/919713383890?text=${encodedMessage}`;
  window.open(whatsappLink, "_blank");
};

const handleWithdraw = () => {
  const message = `UserId: ${user.id}\nName: ${user.username}\nEmail: ${user.email}\nAmount to withdraw: ${amount}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/919713383890?text=${encodedMessage}`;
  window.open(whatsappLink, "_blank");
};


  return (

    <>
   <nav className="h-[100px] p-4 shadow-md">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
         <img
              src={Logo}
             height={100}
              width={100}
              className="absolute top-0 left-4 text-red-700 hover:text-white transition-colors duration-200 text-5xl font-bold z-50 "
              aria-label="Close"
            >
              </img>
              <button
       onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-red-700 hover:text-white transition-colors duration-200 text-5xl font-bold z-50 "
        aria-label="Close"
      >
        &times;
      </button>
      </div>


   </nav>
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 p-4 sm:p-6">
    
      {/* ❌ Close Button */}
     

      <div className="w-full max-w-5xl bg-gradient-to-br from-gray-800 to-gray-700 p-6 sm:p-8 rounded-2xl shadow-2xl text-white border border-gray-700 flex flex-col lg:flex-row gap-6">
        
        {/* Wallet Balance Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center text-center bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">My Wallet</h2>
          <motion.div className="mb-6 text-center" initial={{ scale: 1 }} animate={{ scale: balance !== displayBalance ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}>
            <p className="text-gray-300 mb-1">Current Balance</p>
            <p className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              COINS: {displayBalance.toFixed(2)}
            </p>
          </motion.div>
          <div className="flex w-full bg-gray-700/50 rounded-lg p-1 mb-4">
            <button className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "deposit" ? "bg-green-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`} onClick={() => setActiveTab("deposit")}>
              <ArrowDownCircle size={20} /><span>Deposit</span>
            </button>
            <button className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "withdraw" ? "bg-red-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`} onClick={() => setActiveTab("withdraw")}>
              <ArrowUpCircle size={20} /><span>Withdraw</span>
            </button>
          </div>
          <motion.input type="number" className="w-full p-3 mt-4 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={loading} min="1" whileFocus={{ scale: 1.02 }} />
          <motion.button className={`w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${activeTab === "deposit" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`} onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ArrowDownCircle size={20} />} 
            <span>{loading ? "Processing..." : activeTab === "deposit" ? "Add Funds" : "Withdraw Funds"}</span>
          </motion.button>
        </div>

        {/* Transaction History Section */}
        <div className="w-full lg:w-2/3 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Transaction History</h3>
          <div className="h-60 sm:h-[300px] overflow-y-auto">
            {transactions.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700 text-gray-200">
                  <tr><th className="px-4 py-2">Type</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">Date</th></tr>
                </thead>
                <tbody>
                  {transactions.map((txn, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-all">
                      <td className={`px-4 py-2 ${txn.type === "credit" ? "text-green-400" : "text-red-400"}`}>{txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}</td>
                      <td className="px-4 py-2">COINS {txn.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (<p className="text-gray-400 text-center">No transactions found.</p>)}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default WalletControls;
