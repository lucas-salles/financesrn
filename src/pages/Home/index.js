import React, { useContext } from "react";
import { View, Text, Button } from "react-native";

import { AuthContext } from "../../contexts/auth";

const index = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View>
      <Text>Home</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
      <Button title="Sair" onPress={() => signOut()} />
    </View>
  );
};

export default index;
