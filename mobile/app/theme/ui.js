// mobile/src/theme/ui.js
import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const UI = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    padding: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textDark,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  buttonSuccess: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  mutedText: {
    color: COLORS.textLight,
  },
});
