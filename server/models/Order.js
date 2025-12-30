const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'PENDING',
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    guestEmail: {
      type: DataTypes.STRING, // If user is not logged in
    },
  });

  return Order;
};
