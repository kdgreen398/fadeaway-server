function isValidEmail(email) {
  // Regular expression for a basic email format
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
  // Regular expression for a North American phone number in the format XXX-XXX-XXXX
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
}

function isStrongPassword(password) {
  // Regular expression for a strong password
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isStrongPassword,
};
