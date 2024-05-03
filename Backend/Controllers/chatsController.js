/*const Chat = require("../Models/ChatModel");

const User = require('../Models/UserModel');

const accessChat = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        console.log("UserID param not sent with request");
        return res.status(400).send("UserID param not sent with request");
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        // $and: [
        //  { users: { $elemMatch: { $eq: req.user._id } } },
        //{ users: { $eleMatch: { $eq: userID } } },
        // $all[req.user._id, userID]
        // ],
        users: { $all: [req.user._id, userID] }

    }).populate("users", "-password")
        .populate("latestMessage");

    console.log("isChat 1 : ", isChat);
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    console.log(isChat, "isChat 2 ");
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userID],
        }
    }
    try {
        const createdChat = await Chat.create(chatData);
        console.log("Created Chat : ", createdChat);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
        res.status(200).send(FullChat);
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { accessChat };
*/


const Chat = require("../Models/ChatModel");
const User = require('../Models/UserModel');

const accessChat = async (req, res) => {
    const { userID } = req.body;
    console.log(userID);
    if (!userID) {
        console.log("UserID param not sent with request");
        return res.status(400).send({ msg: "UserID param not sent with request" });
    }

    try {
        // Attempt to find an existing chat
        let isChat = await Chat.findOne({
            isGroupChat: false,
            users: { $all: [req.user._id, userID] }
        }).populate("users", "-password").populate("latestMessage");

        //console.log("isChat 1 : ", isChat);

        if (isChat) {
            // Populate latestMessage.sender field
            isChat = await User.populate(isChat, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.send(isChat);
        } else {
            // Create a new chat
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userID],
            };
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const fetchChats = async (req, res) => {
    try {
        // Find all chats where the logged-in user is a participant
        const userChats = await Chat.find({ users: req.user._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        // Populate the latestMessage.sender field for each chat
        const populatedChats = await User.populate(userChats, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).send(populatedChats);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

const createGroupChat = async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({ msg: "Please fill all the feilds" });
        }
        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res.status(400).send("More than 2 users are required to create group Chat");
        }
        users.push(req.user);

        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        console.log(groupChat, "groupChat......");


        const fullChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullChat);
        //console.log(populate("groupAdmin", "-password"));
    }
    catch (error) {
        console.log("Error : ", error);
        res.status(500).send("Internal Server Error");

    }
};

const renameGroup = async (req, res) => {
    const { chatID, chatName } = req.body;
    try {
        const updateName = await Chat.findByIdAndUpdate(chatID, { chatName: chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

        if (!updateName) {
            return res.status(400).send({ msg: "Chat not found" });
        }
        else {
            res.status(200).json(updateName);
        }
    }
    catch (error) {
        console.log("ERROR : ", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
};







const addToGroup = async (req, res) => {
    const { chatID, userID } = req.body;
    try {
        const addToGroup = await Chat.findByIdAndUpdate(chatID, { $push: { users: userID } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        if (!addToGroup) {
            res.status(400).send("Chat Not Found");
        }
        else {
            res.status(200).json(addToGroup);
        }
    }
    catch (error) {
        console.log("ERROR : ", error);
        res.status(500).send("Internal Server Error");
    }
};

const removeToGroup = async (req, res) => {
    const { chatID, userID } = req.body;
    try {
        const removeToGroup = await Chat.findByIdAndUpdate(chatID, { $pull: { users: userID } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        if (!removeToGroup) {
            res.status(400).send("Chat Not Found");
        }
        else {
            res.status(200).json(removeToGroup);
        }
    }
    catch (error) {
        console.log("ERROR : ", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeToGroup };
