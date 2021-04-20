import React, { createContext, useState, useEffect } from "react";
import firebase from "../services/firebaseConnection";
import AsyncStorage from "@react-native-community/async-storage";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("Auth_user");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function signIn(email, password) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async value => {
        const { uid } = value.user;
        await firebase
          .database()
          .ref("users")
          .child(uid)
          .once("value")
          .then(snapshot => {
            const data = {
              uid,
              name: snapshot.val().name,
              email: value.user.email,
            };

            setUser(data);
            storageUser(data);
          });
      })
      .catch(error => {
        alert(error.code);
      });
  }

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
            storageUser(data);
          });
      })
      .catch(error => {
        alert(error.code);
      });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem("Auth_user", JSON.stringify(data));
  }

  async function signOut() {
    await firebase.auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
