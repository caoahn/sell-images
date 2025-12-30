const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Photo = sequelize.define('Photo', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    originalUrl: {
      type: DataTypes.STRING, // Local path or S3 Key
      allowNull: false,
    },
    watermarkUrl: {
      type: DataTypes.STRING, // Public path
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    resolution: {
      type: DataTypes.STRING,
    },
  });

  return Photo;
};
