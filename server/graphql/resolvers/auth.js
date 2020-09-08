const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = require('../../config/settings').SECRET;

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingEmail = await User.findOne({ email: args.userInput.email });
      if (existingEmail) {
        throw new Error('Email exists already.');
      }

      const existingUsername = await User.findOne({ username: args.userInput.username });
      if (existingUsername) {
        throw new Error('Username exists already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        username: args.userInput.username,
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET,
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, username: user.username, token: token, tokenExpiration: 1 };
  },
  getUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        throw new Error('User does not exist.');
      }

      return { ...user._doc, password: null, _id: user.id };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error('User does not exist.');
      }

      // Only update the properties that were passed
      if (args.userInput.username) {
        user.username = args.userInput.username;
      }

      if (args.userInput.password && args.userInput.password !== 'undefined') {
        user.password = await bcrypt.hash(args.userInput.password, 12);
      }

       if (args.userInput.email) {
        user.email = args.userInput.email;
      }

      const updatedUser = await user.save();
      const token = jwt.sign(
        { userId: updatedUser.id, email: updatedUser.email }, SECRET, { expiresIn: '1h' }
      );
      return { userId: updatedUser.id, username: updatedUser.username, token: token, tokenExpiration: 1 };

    } catch (err) {
      throw err;
    }
  }
};
