const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        messsage: 'Handling GET request to /products'
    })
});


router.post('/', (req, res, next) => {
    res.status(200).json({
        messsage: 'Handling POST request to /products'
    })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        message: 'You are success find the data',
        id
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        messsage: 'Updated product!',
        id
    })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    res.status(200).json({
        messsage: 'Deleted product!',
        id
    })
});

module.exports = router;