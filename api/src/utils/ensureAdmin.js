import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  const adminName = process.env.ADMIN_NAME || "Administrador";

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    if (existing.cargo !== "admin") {
      existing.cargo = "admin";
      await existing.save();
      console.log(`[seed] Usuário ${adminEmail} já existia, cargo ajustado para admin.`);
    } else {
      console.log(`[seed] Usuário admin já existe: ${adminEmail}`);
    }
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.create({
    nome: adminName,
    email: adminEmail,
    senha: hashed,
    cargo: "admin",
  });

  console.log(`[seed] Usuário admin criado: ${adminEmail} / senha: ${adminPassword}`);
}
