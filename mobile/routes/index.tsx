// src/routes/index.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Importações usando caminhos relativos (mais seguro)
import Login from "../app/screens/Login";
import Register from "../app/screens/Register";
import Home from "../app/screens/Home";
import PostDetails from "../app/screens/PostDetails";
import CreatePost from "../app/screens/CreatePost";
import Admin from "../app/screens/Admin";
import EditPost from "../app/screens/EditPost";
import ManageUsers from "../app/screens/ManageUsers";

// Importação do arquivo de tipos
// Ajuste a quantidade de "../" dependendo de onde a pasta 'types' está em relação a 'routes'
import { RootStackParamList } from "../RootStackParamList"

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  const [loading, setLoading] = useState(true);
  
  // DICA: Para evitar o erro de 'Type string', inicialize com null ou uma rota válida
  // Mas o ideal é esperar o useEffect definir.
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Login");

  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setInitialRoute("Home");
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator 
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />      
      <Stack.Screen name="PostDetails" component={PostDetails} options={{ title: "Detalhes" }} />
      <Stack.Screen name="CreatePost" component={CreatePost} options={{ title: "Criar Post" }} />
      <Stack.Screen name="Admin" component={Admin} options={{ title: "Administração" }} />
      <Stack.Screen name="EditPost" component={EditPost} options={{ title: "Editar Post" }} />
      <Stack.Screen name="ManageUsers" component={ManageUsers} options={{ title: "Gerenciar Usuários" }} />
    </Stack.Navigator>
  );
}