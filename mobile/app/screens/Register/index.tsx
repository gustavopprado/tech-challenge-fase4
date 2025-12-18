import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      return Alert.alert("Atenção", "Preencha Nome, Email e Senha!");
    }

    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3000/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "Erro ao registrar");

      Alert.alert("Sucesso", "Conta criada! Fale com o Admin para permissões.");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha na conexão.");
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

      <View style={styles.box}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor={COLORS.textLight}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor={COLORS.textLight}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor={COLORS.textLight}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.75 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },

  box: { padding: 25 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.textDark,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bgLight,
    color: COLORS.textDark,
  },

  // ✅ botão rosa
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "#FFF", fontSize: 17, fontWeight: "700" },

  loginLink: { marginTop: 20, alignSelf: "center" },

  // ✅ link rosa
  loginText: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
});
