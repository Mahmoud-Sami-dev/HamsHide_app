import crypto from "node:crypto";

export function encryption(plaintext) {
  // 8 byte >> 32*8 >> secret key >> 32
  const iv = crypto.randomBytes(16); // 16*2 =32
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"),
    // IV = Initialization Vector (random string)
    iv,
  );
  let encryptedData = cipher.update(plaintext, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return `${iv.toString("hex")}:${encryptedData}`;
}
export function decryption(encryptedData) {
  const [iv, encryptedValue] = encryptedData.split(":");
  const ivBufferLike = Buffer.from(iv, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"),
    ivBufferLike,
  );
  let decryptedValue = decipher.update(encryptedValue, "hex", "utf-8");
  decryptedValue += decipher.final("utf-8");
  return decryptedValue;
}
