const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const photoController = require('../controllers/photoController');
const upload = require('../middleware/upload');

// Events
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getEvents);

// Photos
// Use 'photos' field name for array upload
router.post('/photos/upload', upload.array('photos', 20), photoController.uploadPhotos);
// Schools
const schoolController = require('../controllers/schoolController');
router.get('/schools', schoolController.getAllSchools);
router.post('/schools', schoolController.createSchool);

// Orders
const orderController = require('../controllers/orderController');
router.post('/orders', orderController.createOrder);
router.post('/orders/:id/cancel', orderController.cancelOrder);
router.get('/orders/history', orderController.getMyHistory); // Needs auth middleware

module.exports = router;
