import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [txHashes, setTxHashes] = useState([]);
  const addTxHash = (hash) =>
    setTxHashes((prev) => [hash, ...prev.slice(0, 9)]); // keep last 10
  return (
    <TransactionContext.Provider value={{ txHashes, addTxHash }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
