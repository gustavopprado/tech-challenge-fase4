import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../RootStackParamList";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { COLORS } from "../../theme/colors";

export default function EditPost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [postAtivo, setPostAtivo] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, "EditPost">>();
  const { id } = route.params;

  useEffect(() => {
    fetch(`http://10.0.2.2:3000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitulo(data.titulo || "");
        setDescricao(data.descricao || "");
        setPostAtivo(!!data.postAtivo);
      })
      .catch(() => Alert.alert("Erro", "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, postAtivo }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Atualizado!");
        navigation.navigate("Admin");
      } else {
        Alert.alert("Erro", "Falha ao atualizar");
      }
    } catch (error) {
      Alert.alert("Erro", "Conexão");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.header}>Editar Post</Text>

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

        <View style={styles.row}>
          <Text style={styles.label}>Ativo?</Text>

          <Switch
            value={postAtivo}
            onValueChange={setPostAtivo}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={postAtivo ? COLORS.primary : COLORS.textLight}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleUpdate} activeOpacity={0.9}>
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6F7FB",
  },

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
    backgroundColor: COLORS.bgLight,
    color: COLORS.textDark,
    fontSize: 16,
  },

  textArea: {
    height: 120,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingVertical: 6,
  },

  // ✅ salvar em verde (ação positiva)
  btn: {
    backgroundColor: COLORS.success,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
