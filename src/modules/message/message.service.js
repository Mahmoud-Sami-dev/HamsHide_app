import { NotFoundException, SYS_MESSAGE } from "../../common/index.js";
import { messageRepository } from "../../DB/models/message/message.repository.js";

export const sendMessage = async (
  content,
  files,
  receiverId,
  senderId = undefined,
) => {
  let paths = [];
  if (files) {
    console.log(files);
    paths = files.map((file) => file.path);
  }
  const createdMessage = await messageRepository.create({
    content,
    receiver: receiverId,
    attachment: paths,
    sender: senderId, // id or undefined (anonymous)
  });
  return createdMessage;
};

export const getSpecificMessage = async (id, userId) => {
  const message = await messageRepository.getOne(
    { _id: id, $or: [{ receiver: userId }, { sender: userId }] },
    {},
    {
      populate: [
        { path: "receiver", select: "userName email" },
        {
          path: "sender",
          select: "userName email",
        },
      ],
    },
  ); // {} | null
  if (!message) throw new NotFoundException(SYS_MESSAGE.message.notFound);
  return message;
};

export const getAllMessages = async ( userId) => {
  const messages = await messageRepository.getAll(
    {  $or: [{ receiver: userId }, { sender: userId }] },
    {},
    {
      populate: [
        { path: "receiver", select: "userName email" },
        {
          path: "sender",
          select: "userName email",
        },
      ],
    },
  ); // {} | null
  if (messages.length == 0) throw new NotFoundException("empty you don't have any messages yet!");
  return messages;
};

