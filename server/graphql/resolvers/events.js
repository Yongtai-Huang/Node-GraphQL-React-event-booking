const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();  // hyt: maybe too many
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      startTime: new Date(args.eventInput.startTime),
      endTime: new Date(args.eventInput.endTime),
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
  // updateEvent: async (args, req) => {
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }

  //   if (!args.eventInput.eventId) {
  //     throw new Error('The event not found!');
  //   }

  //   let event;
  //   try {
  //     event = await Event.findById(args.eventInput.eventId);
  //    } catch (err) {
  //     throw err;
  //   }

  //   event.title = args.eventInput.title;
  //   event.description = args.eventInput.description;
  //   event.price = +args.eventInput.price;
  //   event.startTime = new Date(args.eventInput.startTime);
  //   event.endTime = new Date(args.eventInput.endTime);
  //   event.creator = req.userId;

  //   let updatedEvent;
  //   try {
  //     const result = await event.save();
  //     updatedEvent = transformEvent(result);
  //     return updatedEvent;
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  // deleteEvent: async (args, req) => {
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }

  //   try {
  //     await Event.deleteOne({_id: args.eventId});
  //    } catch (err) {
  //     throw err;
  //   }

  //   const creator = await User.findById(req.userId);

  //   if (!creator) {
  //     throw new Error('User not found.');
  //   }
    
  //   creator.createdEvents.map(event => event.toString() !==  args.eventId);
  //   await creator.save();

  //   return;

  // }
};
