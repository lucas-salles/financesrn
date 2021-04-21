import React, { useContext, useState, useEffect } from "react";
import { format } from "date-fns";

import Header from "../../components/Header";
import HistoryList from "../../components/HistoryList";

import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";

import { Background, Container, Name, Balance, Title, List } from "./styles";

const index = () => {
  const [historic, setHistoric] = useState([]);
  const [balance, setBalance] = useState(0);

  const { user } = useContext(AuthContext);
  const uid = user?.uid;

  useEffect(() => {
    async function loadList() {
      firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", snapshot => {
          setBalance(snapshot.val().balance);
        });

      firebase
        .database()
        .ref("history")
        .child(uid)
        .orderByChild("date")
        .equalTo(format(new Date(), "dd/MM/yy"))
        .limitToLast(10)
        .on("value", snapshot => {
          setHistoric([]);

          snapshot.forEach(childItem => {
            const list = {
              key: childItem.key,
              type: childItem.val().type,
              value: childItem.val().value,
            };

            setHistoric(oldArray => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [setHistoric, setBalance]);

  return (
    <Background>
      <Header />

      <Container>
        <Name>{user?.name}</Name>
        <Balance>
          R$ {balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Balance>
      </Container>

      <Title>Últimas movimentações</Title>

      <List
        showsVerticalScrollIndicator={false}
        data={historic}
        keyExtractor={item => item.key}
        renderItem={({ item }) => <HistoryList data={item} />}
      />
    </Background>
  );
};

export default index;
