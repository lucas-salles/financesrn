import React, { useState } from "react";
import { SafeAreaView, Keyboard, TouchableWithoutFeedback } from "react-native";

import Header from "../../components/Header";
import Picker from "../../components/Picker/index.android";

import { Background, Input, SubmitButton, SubmitText } from "./styles";

const New = () => {
  const [value, setValue] = useState("");
  const [type, setType] = useState("receita");

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

          <SubmitButton>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>
        </SafeAreaView>
      </Background>
    </TouchableWithoutFeedback>
  );
};

export default New;
