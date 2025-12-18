import { useState } from "react";
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    if (!user || !password) {
      return Alert.alert("Erro", "Preencha todos os campos!");
    }

    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert("Erro", data.mensagem || "Credenciais inválidas.");
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("nome", data.nome);
      await AsyncStorage.setItem("cargo", data.cargo || "");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <LinearGradient
        style={styles.container}
        colors={["#B8BFCA", "#FFFFFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Entre para acessar os posts</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor={COLORS.textLight}
          onChangeText={setUser}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.75 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.textMedium,
    marginBottom: 30,
  },

  input: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: COLORS.bgLight,
    color: COLORS.textDark,
  },

  // ✅ botão rosa
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  // ✅ link rosa
  registerLink: {
    marginTop: 20,
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
