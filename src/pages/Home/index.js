import React, { useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { format, isPast } from "date-fns";

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
              date: childItem.val().date,
            };

            setHistoric(oldArray => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [firebase, setHistoric, setBalance]);

  function handleDelete(data) {
    if (isPast(new Date(data.date))) {
      alert("Você não pode excluir um registro antigo!");
      return;
    }

    Alert.alert(
      "Cuidado Atenção!",
      `Você deseja excluir ${data.type} - Valor ${data.value}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleDeleteSuccess(data),
        },
      ],
    );
  }

  async function handleDeleteSuccess(data) {
    await firebase
      .database()
      .ref("history")
      .child(uid)
      .child(data.key)
      .remove()
      .then(async () => {
        let currentBalance = balance;
        data.type === "despesa"
          ? (currentBalance += parseFloat(data.value))
          : (currentBalance -= parseFloat(data.value));

        await firebase
          .database()
          .ref("users")
          .child(uid)
          .child("balance")
          .set(currentBalance);
      })
      .catch(error => {
        console.log(error);
      });
  }

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
        renderItem={({ item }) => (
          <HistoryList data={item} deleteItem={handleDelete} />
        )}
      />
    </Background>
  );
};

export default index;
