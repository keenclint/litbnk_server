function generateRandomString() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  // Generate 2 random letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomString += letters.charAt(randomIndex);
  }

  // Generate 13 random numbers
  for (let i = 0; i < 13; i++) {
    randomString += Math.floor(Math.random() * 10);
  }

  return randomString.toUpperCase();
}

module.exports = {
  generateRandomString
};