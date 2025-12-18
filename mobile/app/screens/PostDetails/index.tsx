import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

export default function PostDetails() {
  const route = useRoute<RouteProp<RootStackParamList, "PostDetails">>();
  const { id } = route.params;

  const [post, setPost] = useState<any>(null);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);

  const [userNome, setUserNome] = useState<string>("");
  const [userCargo, setUserCargo] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const storedName = await AsyncStorage.getItem("nome");
      const storedCargo = await AsyncStorage.getItem("cargo");
      if (storedName) setUserNome(storedName);
      if (storedCargo) setUserCargo(storedCargo);

      const resPost = await fetch(`http://10.0.2.2:3000/posts/${id}`);
      if (!resPost.ok) throw new Error("Erro");
      const dataPost = await resPost.json();
      setPost(dataPost);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()} às ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleComentar = async () => {
    if (!novoComentario.trim()) return;

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/posts/${id}/comentarios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario: userNome, texto: novoComentario }),
        }
      );

      if (!response.ok) throw new Error("Erro");

      setNovoComentario("");
      loadData();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível comentar.");
    }
  };

  const handleDeleteComentario = async (comentarioId: string) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(
              `http://10.0.2.2:3000/posts/${id}/comentarios/${comentarioId}`,
              {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: userNome, cargo: userCargo }),
              }
            );
            loadData();
          } catch (error) {
            Alert.alert("Erro", "Falha na conexão.");
          }
        },
      },
    ]);
  };

  const startEditing = (comentarioId: string, currentText: string) => {
    setEditingId(comentarioId);
    setEditedText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedText("");
  };

  const handleSaveEdit = async (comentarioId: string) => {
    if (!editedText.trim()) return Alert.alert("Atenção", "O comentário não pode ser vazio.");

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/posts/${id}/comentarios/${comentarioId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario: userNome,
            cargo: userCargo,
            novoTexto: editedText,
          }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        setEditedText("");
        loadData();
      } else {
        Alert.alert("Erro", "Não foi possível editar.");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro de conexão.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.textDark }}>Post não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.postCard}>
        <Text style={styles.title}>{post.titulo}</Text>
        <Text style={styles.meta}>
          Por <Text style={styles.metaStrong}>{post.autor}</Text> em {formatDate(post.dataCriacao)}
        </Text>
        <Text style={styles.desc}>{post.descricao}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        Comentários ({(post.comentarios || []).length})
      </Text>

      {(post.comentarios || []).map((c: any, index: number) => {
        const isAutor = c.usuario === userNome;
        const isAdmin = userCargo.toLowerCase() === "admin";
        const canModify = isAutor || isAdmin;

        const isEditingThis = editingId === c._id;

        return (
          <View key={c._id || index} style={styles.commentCard}>
            {isEditingThis ? (
              <View>
                <Text style={styles.commentUser}>Editando comentário de {c.usuario}</Text>

                <TextInput
                  style={styles.editInput}
                  value={editedText}
                  onChangeText={setEditedText}
                  multiline
                  placeholder="Edite seu comentário..."
                  placeholderTextColor={COLORS.textLight}
                />

                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => handleSaveEdit(c._id)}
                    style={styles.btnSave}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnTextSmall}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={cancelEditing}
                    style={styles.btnCancel}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnTextSmall}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{c.usuario}</Text>
                  <Text style={styles.commentDate}>{formatDate(c.data)}</Text>
                </View>

                <Text style={styles.commentText}>{c.texto}</Text>

                {canModify && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => startEditing(c._id, c.texto)} activeOpacity={0.8}>
                      <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteComentario(c._id)} activeOpacity={0.8}>
                      <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        );
      })}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentário..."
          placeholderTextColor={COLORS.textLight}
          value={novoComentario}
          onChangeText={setNovoComentario}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleComentar} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ✅ fundo mais leve que rosa
  container: { flex: 1, backgroundColor: "#F6F7FB", padding: 20 },

  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F6F7FB" },

  postCard: {
    backgroundColor: COLORS.bgLight,
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  title: { fontSize: 22, fontWeight: "800", color: COLORS.textDark },
  meta: { color: COLORS.textMedium, fontSize: 12, marginVertical: 6 },
  metaStrong: { color: COLORS.primary, fontWeight: "800" },

  desc: { fontSize: 16, color: COLORS.textMedium, lineHeight: 24, marginTop: 10 },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 10, color: COLORS.textDark },

  commentCard: {
    backgroundColor: COLORS.bgLight,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  commentUser: { fontWeight: "800", color: COLORS.primary },
  commentDate: { fontSize: 10, color: COLORS.textLight, fontWeight: "600" },
  commentText: { color: COLORS.textMedium, marginBottom: 10, lineHeight: 20 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
    marginTop: 6,
  },

  deleteText: { color: COLORS.danger, fontSize: 13, fontWeight: "800" },
  editText: { color: COLORS.primary, fontSize: 13, fontWeight: "800" },

  editInput: {
    backgroundColor: COLORS.bgComment,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    marginVertical: 10,
    color: COLORS.textDark,
    textAlignVertical: "top",
  },

  editActions: { flexDirection: "row", gap: 10 },

  btnSave: {
    backgroundColor: COLORS.success,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  btnCancel: {
    backgroundColor: COLORS.textLight,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  btnTextSmall: { color: "#FFF", fontSize: 12, fontWeight: "800" },

  inputContainer: { marginTop: 18 },

  input: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 12,
    padding: 12,
    minHeight: 70,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    color: COLORS.textDark,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },

  buttonText: { color: "#FFF", fontWeight: "800" },
});
