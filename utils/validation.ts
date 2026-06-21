export function validatePassword(password: string) {
  if (password.length < 8) return "mínimo 8 caracteres";
  return null;
}