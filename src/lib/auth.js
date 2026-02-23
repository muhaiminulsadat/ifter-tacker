import {betterAuth} from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import connectDB from "./db";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  trustedOrigins: [
    "http://192.168.0.103:3000",
    "http://10.18.88.186:3000",
    "*",
  ],
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 1,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "member",
        input: false,
      },
      room: {
        type: "string",
        defaultValue: "",
      },
      avatar: {
        type: "string",
        defaultValue: "",
        input: false,
      },
      isApproved: {type: "boolean", defaultValue: false},
      image: {type: "string", defaultValue: ""},
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {},
      },
      before: async (user) => {
        const seed = encodeURIComponent(user.email);
        return {
          data: {
            ...user,
            avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`,
          },
        };
      },
    },
  },
});

export async function getCurrentUser() {
  const result = await auth.api.getSession({
    headers: await headers(),
  });

  return result.user;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/login");
  }
}
