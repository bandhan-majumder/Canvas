import "next-auth";

declare module "next-auth" {
  // for adding more properties to the user object
  // interface Session {
  //     user: {
  //
  //     } & DefaultSession["user"];
  // }
  // interface User {
  // }
  // interface JWT {
  // }
}

// another method
// declare module "next-auth/jwt" {
//     interface JWT {
//         id: string;
//     }
// }
