import { DBRepository } from "../../db.repository.js";
import { Message } from "./message.model.js";

class MessageRepository extends DBRepository {
  constructor() {
    super(Message);
  }
}

export const messageRepository = new MessageRepository();