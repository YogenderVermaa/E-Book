export const validEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^s@]+\.[^\s@]+$/;
  if (!email) return 'Email required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validPassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Passwrod must be at least 6 charcters';
  return '';
};
