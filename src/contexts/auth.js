import React, {createContext, useState} from 'react';

export const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [user, setUser] = useState({
    name: 'Teste',
    uid: '265456465412165465',
  });

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
