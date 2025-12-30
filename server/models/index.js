const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const School = require('./School')(sequelize, DataTypes);
const Event = require('./Event')(sequelize, DataTypes);
const Photo = require('./Photo')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

// Associations

// School <-> Event
School.hasMany(Event, { foreignKey: 'schoolId' });
Event.belongsTo(School, { foreignKey: 'schoolId' });

// Event <-> Photo
Event.hasMany(Photo, { foreignKey: 'eventId' });
Photo.belongsTo(Event, { foreignKey: 'eventId' });

// Photographer <-> Photo (Optional, or link via Event)
User.hasMany(Photo, { foreignKey: 'photographerId' });
Photo.belongsTo(User, { as: 'photographer', foreignKey: 'photographerId' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Photo <-> OrderItem
Photo.hasMany(OrderItem, { foreignKey: 'photoId' });
OrderItem.belongsTo(Photo, { foreignKey: 'photoId' });


const db = {
  sequelize,
  Sequelize: require('sequelize'),
  User,
  School,
  Event,
  Photo,
  Order,
  OrderItem,
};

module.exports = db;
