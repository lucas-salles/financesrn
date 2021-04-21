import React, { useContext, useState } from "react";

import Header from "../../components/Header";
import RecordList from "../../components/RecordList";

import { AuthContext } from "../../contexts/auth";

import { Background, Container, Name, Balance, Title, List } from "./styles";

const index = () => {
  const [record, setRecord] = useState([
    { key: "1", type: "receita", value: 1200 },
    { key: "2", type: "despesa", value: 200 },
    { key: "3", type: "receita", value: 100 },
    { key: "4", type: "receita", value: 1000 },
    { key: "5", type: "despesa", value: 1000 },
    { key: "6", type: "receita", value: 1000 },
    { key: "7", type: "despesa", value: 1000 },
    { key: "8", type: "receita", value: 1000 },
  ]);
  const { user } = useContext(AuthContext);

  return (
    <Background>
      <Header />

      <Container>
        <Name>{user?.name}</Name>
        <Balance>R$ 120,00</Balance>
      </Container>

      <Title>Últimas movimentações</Title>

      <List
        showsVerticalScrollIndicator={false}
        data={record}
        keyExtractor={item => item.key}
        renderItem={({ item }) => <RecordList data={item} />}
      />
    </Background>
  );
};

export default index;
