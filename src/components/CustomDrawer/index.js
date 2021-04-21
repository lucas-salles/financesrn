import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { AuthContext } from "../../contexts/auth";

const CustomDrawer = props => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 25,
        }}>
        <Image
          source={require("../../assets/Logo.png")}
          style={{ width: 85, height: 85 }}
          resizeMode="contain"
        />

        <Text style={{ color: "#FFF", fontSize: 18, marginTop: 5 }}>
          Bem-vindo
        </Text>

        <Text
          style={{
            color: "#FFF",
            fontSize: 16,
            fontWeight: "bold",
            paddingBottom: 25,
          }}>
          {user?.name}
        </Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        {...props}
        label="Sair"
        inactiveBackgroundColor="#c62c36"
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
