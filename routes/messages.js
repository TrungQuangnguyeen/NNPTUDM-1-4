const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Giả sử có middleware authentication để lấy currentUserId
// const verify = require('../middleware/verify');

// GET /:userID - Lấy toàn bộ message giữa user hiện tại và userID
router.get('/:userID', async (req, res) => {
  try {
    const currentUserId = req.user.id; // Từ token/session
    const targetUserId = req.params.userID;

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: targetUserId },
        { from: targetUserId, to: currentUserId },
      ],
    })
      .populate('from', 'name email')
      .populate('to', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
});

// POST / - Gửi message (file hoặc text)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const currentUserId = req.user.id; // Từ token/session
    const { to, type, text } = req.body;

    let messageContent = {};

    if (type === 'file') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp file',
        });
      }
      messageContent = {
        type: 'file',
        text: req.file.path, // Đường dẫn file
      };
    } else if (type === 'text') {
      if (!text) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp nội dung text',
        });
      }
      messageContent = {
        type: 'text',
        text: text, // Nội dung text
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Type phải là "file" hoặc "text"',
      });
    }

    const newMessage = new Message({
      from: currentUserId,
      to: to,
      messageContent: messageContent,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Gửi message thành công',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
});

// GET / - Lấy message cuối cùng với mỗi user mà user hiện tại có liên hệ
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.user.id; // Từ token/session

    // Lấy tất cả các user mà user hiện tại có liên hệ
    const relatedUsers = await Message.aggregate([
      {
        $match: {
          $or: [{ from: currentUserId }, { to: currentUserId }],
        },
      },
      {
        $group: {
          _id: {
            user: {
              $cond: [
                { $eq: ['$from', currentUserId] },
                '$to',
                '$from',
              ],
            },
          },
          lastMessageId: { $last: '$_id' },
          lastMessageTime: { $last: '$createdAt' },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    // Lấy chi tiết message cuối cùng
    const messageIds = relatedUsers.map((item) => item.lastMessageId);
    const lastMessages = await Message.find({
      _id: { $in: messageIds },
    })
      .populate('from', 'name email')
      .populate('to', 'name email');

    res.status(200).json({
      success: true,
      count: lastMessages.length,
      data: lastMessages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
});

module.exports = router;
