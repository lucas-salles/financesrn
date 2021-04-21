import React from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

import { Container, ButtonMenu } from "./styles";

const Header = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <ButtonMenu onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" color="#FFF" size={35} />
      </ButtonMenu>
    </Container>
  );
};

export default Header;
