import React, { createContext, useContext, useState } from 'react';

const PUBLIC_NODE = '';
const LOCAL_NODE = 'http://localhost:57291';

const NodeContext = createContext();

export function NodeProvider({ children }) {
  const [nodeUrl, setNodeUrl] = useState(PUBLIC_NODE);
  return (
    <NodeContext.Provider
      value={{ nodeUrl, setNodeUrl, LOCAL_NODE ,PUBLIC_NODE }}
    >
      {children}
    </NodeContext.Provider>
  );
}

export function useNode() {
  return useContext(NodeContext);
}
