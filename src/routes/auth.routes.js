import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

const AuthStack = createStackNavigator();

const AuthRoutes = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerStyle: {
            backgroundColor: "#131313",
            borderWidth: 1,
            borderBottomColor: "#00B94A",
          },
          headerTintColor: "#FFF",
          headerBackTitleVisible: false,
          headerTitle: "Cadastro",
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
