import React from "react";
import Icon from "react-native-vector-icons/Feather";

import { Container, Type, IconView, TypeText, ValueText } from "./styles";

const RecordList = ({ data }) => {
  return (
    <Container>
      <Type>
        <IconView type={data.type}>
          <Icon
            name={data.type === "despesa" ? "arrow-down" : "arrow-up"}
            color="#FFF"
            size={20}
          />
          <TypeText>{data.type}</TypeText>
        </IconView>
      </Type>

      <ValueText>R$ {data.value}</ValueText>
    </Container>
  );
};

export default RecordList;
