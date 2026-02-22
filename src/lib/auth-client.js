import {createAuthClient} from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.BASE_URL,
  trustedOrigins: ["http://192.168.0.103:3000"],
});
