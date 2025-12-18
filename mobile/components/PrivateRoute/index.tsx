import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "../../RootStackParamList";

type PrivateRouteProps = {
  children: React.ReactNode;
  role?: "admin" | "professor" | "aluno";
};

export function PrivateRoute({ children, role }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => { checkPermission(); }, []);

  const checkPermission = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userCargo = (await AsyncStorage.getItem("cargo")) || "";
      const cargoLower = userCargo.toLowerCase();

      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }

      if (role) {
        // REGRA 1 e 3: Se a rota exige professor, ADMIN também passa.
        const isProfessorRoute = role === "professor";
        const isAdmin = cargoLower === "admin";
        const isProfessor = cargoLower === "professor";

        // Permissão = tem o cargo exato OU é Admin entrando em rota de prof
        const temPermissao = (cargoLower === role.toLowerCase()) || (isProfessorRoute && isAdmin);

        if (!temPermissao) {
          Alert.alert("Acesso Negado", "Área restrita.");
          navigation.goBack();
          return;
        }
      }
      setAuthorized(true);
    } catch (error) { navigation.navigate("Login"); } finally { setLoading(false); }
  };

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" color="#1A73E8" /></View>;
  if (!authorized) return null;

  return <>{children}</>;
}