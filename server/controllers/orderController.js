const { Order, OrderItem, Photo, Event } = require('../models');

// Calculate hours difference
const getHoursDiff = (date1, date2) => {
  return Math.abs(date1 - date2) / 36e5;
};

exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;
    const userId = req.user ? req.user.id : null; // Assuming auth middleware

    const order = await Order.create({
      UserId: userId,
      totalAmount,
      paymentMethod, // 'GMO_CREDIT', 'COD', etc.
      status: 'PENDING'
    });

    // Create OrderItems
    // In real app, loop and create

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 12h Rule
    const diffHours = getHoursDiff(new Date(), new Date(order.createdAt));
    if (diffHours > 12) {
      return res.status(400).json({ error: 'Cannot cancel order after 12 hours.' });
    }

    if (['COMPLETED', 'SHIPPING'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel processed order.' });
    }

    // Call GMO API to Void transaction if paymentMethod is Credit (Stub)
    if (order.paymentMethod === 'GMO_CREDIT') {
      console.log('Calling GMO API to Void Transaction...');
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    // Group by Album (Event) logic would likely be processed on Frontend or here
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [
        // Include logic to get Photo -> Event hierarchy if needed
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
