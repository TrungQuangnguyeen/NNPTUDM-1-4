const mongoose = require('mongoose');
const User = require('../schemas/users');
const Role = require('../schemas/roles');
const Message = require('../models/Message');

async function createTestData() {
  try {
    // Kết nối MongoDB
    await mongoose.connect('mongodb://localhost:27017/NNPTUD-C4');
    console.log('Connected to MongoDB');

    // Tạo hoặc lấy role "User"
    let userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      userRole = await Role.create({
        name: 'User',
        description: 'Regular user role'
      });
      console.log('Created User role');
    }

    // Tạo 3 user test
    const user1 = await User.create({
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'password123',
      fullName: 'Test User 1',
      role: userRole._id
    });

    const user2 = await User.create({
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
      fullName: 'Test User 2',
      role: userRole._id
    });

    const user3 = await User.create({
      username: 'testuser3',
      email: 'testuser3@example.com',
      password: 'password123',
      fullName: 'Test User 3',
      role: userRole._id
    });

    console.log('Created users:');
    console.log('User 1 ID:', user1._id);
    console.log('User 2 ID:', user2._id);
    console.log('User 3 ID:', user3._id);

    // Tạo messages test
    const messages = await Message.insertMany([
      {
        from: user1._id,
        to: user2._id,
        messageContent: {
          type: 'text',
          text: 'Hi User 2, how are you?'
        }
      },
      {
        from: user2._id,
        to: user1._id,
        messageContent: {
          type: 'text',
          text: 'I am fine, thanks for asking!'
        }
      },
      {
        from: user1._id,
        to: user2._id,
        messageContent: {
          type: 'text',
          text: 'Great! Let me send you a file'
        }
      },
      {
        from: user1._id,
        to: user2._id,
        messageContent: {
          type: 'file',
          text: 'uploads/sample_document.pdf'
        }
      },
      {
        from: user3._id,
        to: user1._id,
        messageContent: {
          type: 'text',
          text: 'Hello User 1!'
        }
      },
      {
        from: user1._id,
        to: user3._id,
        messageContent: {
          type: 'text',
          text: 'Hi User 3, nice to meet you'
        }
      }
    ]);

    console.log('Created messages:', messages.length);
    console.log('\n=== TEST DATA READY ===');
    console.log('Use these IDs in Postman headers:');
    console.log('- user-id: ' + user1._id);
    console.log('- to (target user): ' + user2._id);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

// Run if file is executed directly
if (require.main === module) {
  createTestData();
}

module.exports = createTestData;
