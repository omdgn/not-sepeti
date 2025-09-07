const extractEmailDomain = (email) => {
  if (!email.includes("@")) return "";
  return email.split("@")[1].trim().toLowerCase();
};

module.exports = extractEmailDomain;
