import React, { createContext, useContext, useState } from 'react';

// Create the context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataChanged, setDataChanged] = useState(false);

  return (
    <DataContext.Provider value={{ dataChanged, setDataChanged }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);

// export const useUser = () => useContext(UserContext);
