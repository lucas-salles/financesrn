import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "../pages/Home";
import New from "../pages/New";
import Profile from "../pages/Profile";

const AppDrawer = createDrawerNavigator();

const AppRoutes = () => {
  return (
    <AppDrawer.Navigator
      drawerStyle={{ backgroundColor: "#171717" }}
      drawerContentOptions={{
        labelStyle: { fontWeight: "bold" },
        activeTintColor: "#FFF",
        activeBackgroundColor: "#00b94a",
        inactiveBackgroundColor: "#000",
        inactiveTintColor: "#DDD",
        itemStyle: {
          marginVertical: 5,
        },
      }}>
      <AppDrawer.Screen name="Home" component={Home} />
      <AppDrawer.Screen name="Registrar" component={New} />
      <AppDrawer.Screen name="Perfil" component={Profile} />
    </AppDrawer.Navigator>
  );
};

export default AppRoutes;
