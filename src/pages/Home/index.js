import React, { useContext, useState, useEffect } from "react";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { format, isBefore } from "date-fns";

import Header from "../../components/Header";
import HistoryList from "../../components/HistoryList";
import DatePicker from "../../components/DatePicker";

import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/firebaseConnection";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  Background,
  Container,
  Name,
  Balance,
  Title,
  List,
  Area,
} from "./styles";

const index = () => {
  const [historic, setHistoric] = useState([]);
  const [balance, setBalance] = useState(0);
  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);

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
        .equalTo(format(newDate, "dd/MM/yyyy"))
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
  }, [firebase, setHistoric, setBalance, newDate]);

  function handleDelete(data) {
    const [day, month, year] = data.date.split("/");
    const dateItem = new Date(`${year}/${month}/${day}`);

    const currentDate = format(new Date(), "dd/MM/yyyy");
    const [currentDay, currentMonth, currentYear] = currentDate.split("/");
    const formattedCurrentDate = new Date(
      `${currentYear}/${currentMonth}/${currentDay}`,
    );

    if (isBefore(dateItem, formattedCurrentDate)) {
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

  function handleShowPicker() {
    setShow(true);
  }

  function handleClose() {
    setShow(false);
  }

  const onChange = date => {
    setShow(Platform.OS === "ios");
    setNewDate(date);
  };

  return (
    <Background>
      <Header />

      <Container>
        <Name>{user?.name}</Name>
        <Balance>
          R$ {balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Balance>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#FFF" size={30} />
        </TouchableOpacity>
        <Title>Últimas movimentações</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historic}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <HistoryList data={item} deleteItem={handleDelete} />
        )}
      />

      {show && (
        <DatePicker onClose={handleClose} date={newDate} onChange={onChange} />
      )}
    </Background>
  );
};

export default index;
