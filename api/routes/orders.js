const express = require('express');
const router = express.Router();

const Order = require('../models/order')
const Product = require('../models/products');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Order.find().populate('product', 'name').select('product quantity _id').then(result => {
        res.status(200).json({message: 'success', count: result.length, data: result.map(item => {
            return {
                product: item.product,
                quantity: item.quantity,
                _id: item._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + item._id
                }
            }
        })});
    }).catch(err => {
        res.status(500).json({error: err});
    })
});


router.post('/', (req, res, next) => {

    Product.findById(req.body.productId).then(product => {
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        order.save().then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order created',
                createdOrder: {
                    _id: result._id,
                    product: result.product
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        })
    }).catch(err => {
        res.status(500).json({error: err});
    })

});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).populate('product').select('product quantity _id').exec().then(result => {
        if (!result) {
            return res.status(404).json({message: 'Order not found'});
        }

        res.status(200).json({
            order: result
        });
    }).catch(err => {
        res.status(500).json({error: err});
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
    Order.findByIdAndRemove({_id: id}).exec().then(doc => {
        if (doc) {
            res.status(200).json({message: `Success delete data with id ${id}`})
        } else {
            res.status(404).json({message: `The entry data is not provided. ${id}`})
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
});

module.exports = router;