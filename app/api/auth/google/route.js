import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return new Response(JSON.stringify({ error: "Missing idToken" }), {
        status: 400,
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    // TODO: Check if user exists in DB, else create user
    // Example: const user = await findOrCreateUser({ email, name, picture, googleId: sub });

    // TODO: Generate your own JWT or session token
    const token = generateCustomToken({ email, name, picture, googleId: sub });
    console.log("payload:>", payload);
    return new Response(
      JSON.stringify({
        accessToken: token,
        user: {
          email,
          name,
          picture,
          googleId: sub,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Google Login Error:", err);
    return new Response(
      JSON.stringify({ error: "Invalid token or internal error" }),
      { status: 401 }
    );
  }
}

// Replace this with real token generation (JWT or other)
function generateCustomToken(user) {
  // e.g., return jwt.sign(user, process.env.JWT_SECRET);
  return `custom-token-for-${user.email}`;
}
