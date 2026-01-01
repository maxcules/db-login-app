const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { findUserByEmail } = require("../models/user.model");
const { createToken } = require("../models/token.model");

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  const token = uuidv4();
  await createToken({ token, userId: user.id });

  return {
    ok: true,
    token,
    user: { id: user.id, email: user.email }
  };
}

module.exports = { login };