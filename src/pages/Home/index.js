import React, {useContext} from "react";
import { View, Text } from "react-native";

import {AuthContext} from '../../contexts/auth'

const index = () => {
  const {user} = useContext(AuthContext)

  return (
    <View>
      <Text>Home</Text>
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
};

export default index;
