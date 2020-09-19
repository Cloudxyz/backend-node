const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_ID);

const verifyGoogleSignIn = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    return { name, email, picture };
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  verifyGoogleSignIn,
};
