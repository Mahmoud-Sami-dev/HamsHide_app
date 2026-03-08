import pkg from "bcryptjs";
export async function hash(password) {
 return await pkg.hash(password, 10);
}
export async function compare(password, hashedPassword) {
 return await pkg.compare(password, hashedPassword);
}
