const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        messsage: 'Handling GET request to /orders'
    })
});


router.post('/', (req, res, next) => {
    res.status(200).json({
        messsage: 'Handling POST request to /orders'
    })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'You are success find the data',
        id
    })
})

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        messsage: 'Updated order!',
        id
    })
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        messsage: 'Deleted order!',
        id
    })
});

module.exports = router;