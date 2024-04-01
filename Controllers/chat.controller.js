import { TryCatch } from "../middlewares/error.js";
import { Errorhandler } from "../utils/utility.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMembers } from "../lib/helper.js";
import { User } from "../models/user.model.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (members.length < 2)
    return next(
      new Errorhandler("Group chat must have atleast 3 members", 400)
    );

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group created",
  });
});

export const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name  avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMembers(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, current) => {
        if (current._id.toString() === req.user.toString()) {
          prev.push(current._id);
        }

        return prev;
      }, []),
    };
  });
  return res.status(200).json({
    success: true,
    transformedChats,
  });
});

export const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  if (!members || members.length < 1)
    return next(new Errorhandler("Please provide members", 404));

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new Errorhandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new Errorhandler("This is  not a group chat ", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new Errorhandler("Only the owner can invite users to this chat", 401)
    );
  }

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);
  console.log(allNewMembers);
  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  console.log("uniq", uniqueMembers);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100)
    return next(new Errorhandler("Group members limit reached"));

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added in the group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

export const removeMembers = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const [chat, userThatWillBeremove] = await Promise.all([
    chat.findById(chatId),
    User.findById(userId, "name"),
  ]);
  if (!chat) return next(new Errorhandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new Errorhandler("This is  not a group chat ", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new Errorhandler("Only the owner can invite users to this chat", 401)
    );
  }

  if (chat.members.length <= 3)
    return next(new Errorhandler("Group must have atleast 3 members", 400));

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeremove.name} has been removed from the group`
  );
  emitEvent(req, REFETCH_CHATS, chat.member);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

export const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new Errorhandler("Chat not found", 404));

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if(remainingMembers.length < 3){ 
    return next( new Errorhandler("Group must have at least 3 numbers",400))
  }

  if (chat.creator.toString() === req.user.toString()) {
    const newCreator = remainingMembers[0];

    chat.creator = newCreator;
  }

  if (!chat.groupChat)
    return next(new Errorhandler("This is  not a group chat ", 400));

  chat.members = remainingMembers;
const user = await User.findById(req.user,"name")
  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    ` User ${user.name} has left  the group`
  );
  emitEvent(req, REFETCH_CHATS, chat.member);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});
