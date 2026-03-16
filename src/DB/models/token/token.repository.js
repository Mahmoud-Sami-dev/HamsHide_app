import { DBRepository } from "../../db.repository.js";
import { Token } from "./token.model.js";

class TokenRepository extends DBRepository {
  constructor() {
    super(Token);
  }
}
export const tokenRepository = new TokenRepository();
