import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "../../../RootStackParamList";
import { COLORS } from "../../theme/colors";

interface Post {
  _id: string;
  titulo: string;
  descricao: string;
  autor: string;
  postAtivo: boolean;
  dataCriacao: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cargo, setCargo] = useState("");

  const navigation = useNavigation<NavigationProp>();

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

  const loadData = async () => {
    try {
      const storedCargo = await AsyncStorage.getItem("cargo");
      const currentCargo = storedCargo || "";
      setCargo(currentCargo);

      const isAdminOrProf =
        currentCargo.toLowerCase() === "admin" ||
        currentCargo.toLowerCase() === "professor";
      const endpoint = isAdminOrProf ? "/posts/professor" : "/posts";

      const response = await fetch(`http://10.0.2.2:3000${endpoint}`);
      if (!response.ok) throw new Error("Falha ao buscar posts");

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const filtrados = posts.filter((p) => {
    const t = (p.titulo || "").toLowerCase();
    const d = (p.descricao || "").toLowerCase();
    const q = busca.toLowerCase();
    return t.includes(q) || d.includes(q);
  });

  const cargoLower = cargo.toLowerCase();
  const isAdmin = cargoLower === "admin";
  const isProfessor = cargoLower === "professor";
  const canManagePosts = isAdmin || isProfessor;

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.author}>{item.autor}</Text>
        <Text style={styles.date}>{formatDate(item.dataCriacao)}</Text>
      </View>

      <Text style={styles.postTitle}>
        {item.titulo}
        {!item.postAtivo && (
          <Text style={styles.inactiveText}> (Inativo)</Text>
        )}
      </Text>

      <Text style={styles.postDescription} numberOfLines={3}>
        {item.descricao}
      </Text>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate("PostDetails", { id: item._id })}
        activeOpacity={0.8}
      >
        <Text style={styles.detailsButtonText}>Ver mais...</Text>
      </TouchableOpacity>
    </View>
  );

  return (
      <LinearGradient
        style={styles.container}
        colors={["#B8BFCA", "#FFFFFF"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Feed de Posts</Text>
          <Text style={styles.headerSub}>
            {cargo ? `Logado como: ${cargo}` : "Sem cargo"}
          </Text>
        </View>

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {canManagePosts && (
        <View style={styles.adminContainer}>
          <TouchableOpacity
            style={[styles.adminButton, styles.btnPrimary]}
            onPress={() => navigation.navigate("CreatePost")}
            activeOpacity={0.85}
          >
            <Text style={styles.adminButtonText}>+ Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.adminButton, styles.btnDark]}
            onPress={() => navigation.navigate("Admin")}
            activeOpacity={0.85}
          >
            <Text style={styles.adminButtonText}>Painel Posts</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={[styles.adminButton, styles.btnPrimaryDark]}
              onPress={() => navigation.navigate("ManageUsers")}
              activeOpacity={0.85}
            >
              <Text style={styles.adminButtonText}>Painel Usuários</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar posts..."
          placeholderTextColor={COLORS.textLight}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
  },

  headerSub: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },

  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },

  adminContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
    flexWrap: "wrap",
  },

  adminButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 92,
    alignItems: "center",
    marginBottom: 5,
  },

  btnPrimary: { backgroundColor: COLORS.primary },
  btnPrimaryDark: { backgroundColor: COLORS.primaryDark },
  btnDark: { backgroundColor: COLORS.textDark },

  adminButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13,
  },

  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  searchInput: {
    backgroundColor: COLORS.bgLight,
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,

    // mantém sombra leve estilo site
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    color: COLORS.textDark,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: COLORS.bgLight,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.borderLight,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  author: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },

  date: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
  },

  postTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 6,
  },

  inactiveText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "700",
  },

  postDescription: {
    fontSize: 14,
    color: COLORS.textMedium,
    marginBottom: 12,
    lineHeight: 20,
  },

  detailsButton: {
    alignSelf: "flex-start",
    paddingVertical: 5,
  },

  detailsButtonText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.textMedium,
    marginTop: 50,
    fontSize: 16,
    fontWeight: "600",
  },
});
