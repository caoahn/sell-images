const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING, // Hashed
      allowNull: true, // Nullable for parents utilizing access codes only?? No, parents usually guest or registered.
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'SCHOOL_ADMIN', 'PHOTOGRAPHER', 'PARENT'),
      defaultValue: 'PARENT',
    },
    fullName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
