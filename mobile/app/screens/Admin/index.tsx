import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { NavigationProp } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

export default function Admin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://10.0.2.2:3000/posts/professor");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar posts.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "Deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`http://10.0.2.2:3000/posts/${id}`, { method: "DELETE" });
            loadPosts();
          } catch (error) {
            Alert.alert("Erro", "Erro ao excluir.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => {
    const ativo = !!item.postAtivo;

    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.titulo}
          </Text>

          <View style={[styles.badge, ativo ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{ativo ? "Ativo" : "Inativo"}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={() => navigation.navigate("EditPost", { id: item._id })}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDel}
            onPress={() => handleDelete(item._id)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <PrivateRoute role="professor">
      <View style={styles.container}>
        <Text style={styles.header}>Painel de Posts</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum post.</Text>
            }
          />
        )}
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

  loadingWrap: { marginTop: 40 },

  card: {
    backgroundColor: COLORS.bgLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeActive: { backgroundColor: COLORS.successDark },
  badgeInactive: { backgroundColor: COLORS.danger },

  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  actions: { flexDirection: "row", gap: 10, marginTop: 14 },

  btnEdit: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  btnDel: {
    backgroundColor: COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  btnText: { color: "#FFF", fontWeight: "800" },

  emptyText: {
    textAlign: "center",
    color: COLORS.textMedium,
    marginTop: 40,
    fontSize: 16,
    fontWeight: "600",
  },
});
