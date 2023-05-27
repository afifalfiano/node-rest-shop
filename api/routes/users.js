const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/signup', userController.sign_up);
router.post('/signin', userController.sign_in);
router.delete('/:userId', userController.delete)
module.exports = router;