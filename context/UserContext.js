import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roomCode, setRoomCode] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, roomCode, setRoomCode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);