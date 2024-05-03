const Message = require('../Models/MessageModel');
const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        // Create a new message
        var message = await Message.create(newMessage);

        // Populate the sender field of the new message
        await message.populate("sender", "name pic");

        // Populate the chat field of the new message
        await message.populate("chat");

        // Populate the chat.users field of the new message
        await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        // Update the latestMessage field of the corresponding Chat document
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        // Send the new message in the response
        res.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(400).json({ message: 'Error sending message' });
    }

};


const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};



/*
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    try {
        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.status(400).json({ success: false, message: "Invalid data passed into request" });
        }

        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json({ success: true, message: "Message sent successfully", data: message });
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ success: false, message: "An error occurred while sending the message" });
    }
};
*/

module.exports = { sendMessage, allMessages };