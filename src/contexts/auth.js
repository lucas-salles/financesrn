import React, { createContext, useState } from "react";
import firebase from "../services/firebaseConnection";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function signUp(name, email, password) {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async value => {
        const { uid } = value.user;
        await firebase
          .database()
          .ref("users")
          .child(uid)
          .set({
            balance: 0,
            name,
          })
          .then(() => {
            const data = {
              uid,
              name,
              email: value.user.email,
            };
            setUser(data);
          });
      });
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
