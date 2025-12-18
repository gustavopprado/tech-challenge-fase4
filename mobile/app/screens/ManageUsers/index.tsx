import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PrivateRoute } from "../../../components/PrivateRoute";
import { COLORS } from "../../theme/colors";

interface User {
  _id: string;
  nome: string;
  email: string;
  cargo: string;
}

function formatCargo(cargo?: string) {
  const c = (cargo || "aluno").toLowerCase();
  if (c === "admin") return "Admin";
  if (c === "professor") return "Professor";
  return "Aluno";
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://10.0.2.2:3000/usuarios");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const handleChangeRole = async (id: string, novoCargo: string, nome: string) => {
    Alert.alert(
      "Alterar Cargo",
      `Deseja mudar ${nome} para ${novoCargo.toUpperCase()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              const res = await fetch(`http://10.0.2.2:3000/usuarios/${id}/cargo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ novoCargo }),
              });

              if (res.ok) {
                Alert.alert("Sucesso", "Cargo atualizado!");
                loadUsers();
              } else {
                Alert.alert("Erro", "Falha ao atualizar.");
              }
            } catch (e) {
              Alert.alert("Erro", "Erro de conexão.");
            }
          },
        },
      ]
    );
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const nome = (u.nome || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return nome.includes(q) || email.includes(q);
    });
  }, [users, search]);

  const renderItem = ({ item }: { item: User }) => {
    const cargo = (item.cargo || "aluno").toLowerCase();
    const isAdmin = cargo === "admin";

    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>

          {/* ✅ cargo só texto */}
          <Text style={styles.roleText}>Cargo: {formatCargo(item.cargo)}</Text>
        </View>

        {/* Admin não muda cargo (UI) */}
        {!isAdmin && (
          <View style={styles.actions}>
            {cargo !== "professor" && (
              <TouchableOpacity
                style={styles.btnPromote}
                onPress={() => handleChangeRole(item._id, "professor", item.nome)}
              >
                <Text style={styles.btnText}>Virar Prof.</Text>
              </TouchableOpacity>
            )}

            {cargo !== "aluno" && (
              <TouchableOpacity
                style={styles.btnDemote}
                onPress={() => handleChangeRole(item._id, "aluno", item.nome)}
              >
                <Text style={styles.btnText}>Virar Aluno</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <PrivateRoute role="admin">
      <View style={styles.container}>
        <Text style={styles.header}>Gestão de Usuários</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar por nome ou e-mail..."
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
          style={styles.searchInput}
        />

        {!loading && (
          <Text style={styles.counter}>
            {filteredUsers.length} usuário(s) encontrado(s)
          </Text>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={{ color: COLORS.textLight }}>
                  Nenhum usuário encontrado.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.bgLight },

  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.textDark,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textDark,
    marginBottom: 10,
  },

  counter: { marginBottom: 12, color: COLORS.textMedium },

  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: { flex: 1, paddingRight: 12 },

  name: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  email: { fontSize: 14, color: COLORS.textMedium, marginTop: 2 },

  roleText: {
    marginTop: 8,
    color: COLORS.textLight,
    fontWeight: "600",
  },

  actions: { flexDirection: "column", gap: 8 },

  btnPromote: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 110,
    alignItems: "center",
  },

  btnDemote: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 110,
    alignItems: "center",
  },

  btnText: { color: "#FFF", fontSize: 12, fontWeight: "800" },
});
