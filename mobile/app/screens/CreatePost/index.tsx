import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { NavigationProp } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

export default function CreatePost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const handleCreate = async () => {
    if (!titulo.trim() || !descricao.trim()) return Alert.alert("Atenção", "Preencha tudo!");

    setLoading(true);
    const nome = await AsyncStorage.getItem("nome");

    try {
      const response = await fetch("http://10.0.2.2:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descricao,
          autor: nome || "Desconhecido",
          postAtivo: true,
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Post criado!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Erro", "Falha ao criar post.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.header}>Criar Post</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Digite o título..."
          placeholderTextColor={COLORS.textLight}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          placeholder="Digite a descrição..."
          placeholderTextColor={COLORS.textLight}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.75 }]}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F6F7FB" },

  header: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    color: COLORS.textDark,
  },

  label: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
    color: COLORS.textDark,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: COLORS.bgLight,
    color: COLORS.textDark,
  },

  textArea: {
    height: 120,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
});
