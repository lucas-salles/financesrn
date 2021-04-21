import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

import { AuthContext } from "../../contexts/auth";

import Header from "../../components/Header";
import Picker from "../../components/Picker/index.android";
import firebase from "../../services/firebaseConnection";

import { Background, Input, SubmitButton, SubmitText } from "./styles";

const New = () => {
  const navigation = useNavigation();

  const { user: usuario } = useContext(AuthContext);

  const [value, setValue] = useState("");
  const [type, setType] = useState("receita");

  function handleSubmit() {
    Keyboard.dismiss();
    if (isNaN(parseFloat(value)) || type === null) {
      alert("Preencha todos os campos!");
      return;
    }

    Alert.alert(
      "Confirmando dados",
      `Tipo ${type} - Valor: ${parseFloat(value)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleAdd(),
        },
      ],
    );
  }

  async function handleAdd() {
    const uid = usuario.uid;

    const key = firebase.database().ref("history").child(uid).push().key;
    await firebase
      .database()
      .ref("history")
      .child(uid)
      .child(key)
      .set({
        type,
        value: parseFloat(value),
        date: format(new Date(), "dd/MM/yy"),
      });

    const user = firebase.database().ref("users").child(uid);
    await user.once("value").then(snapshot => {
      let balance = parseFloat(snapshot.val().balance);

      type === "despesa"
        ? (balance -= parseFloat(value))
        : (balance += parseFloat(value));

      user.child("balance").set(balance);
    });

    setValue("");
    navigation.navigate("Home");
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Background>
        <Header />

        <SafeAreaView style={{ alignItems: "center" }}>
          <Input
            placeholder="Valor desejado"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => Keyboard.dismiss()}
            value={value}
            onChangeText={text => setValue(text)}
          />

          <Picker type={type} onChange={setType} />

          <SubmitButton onPress={handleSubmit}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
};

export default New;
