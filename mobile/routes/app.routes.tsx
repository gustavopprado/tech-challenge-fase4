import Home from "@/app/screens/Home";
import Login from "@/app/screens/Login";
import Register from "@/app/screens/Register"; 
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootStackParamList";

// Aplique o tipo RootStackParamList
const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      {/* Nomes de rotas simplificados e tipados */}
      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} /> 
      <Screen name="Home" component={Home} />
    </Navigator>
  );
}