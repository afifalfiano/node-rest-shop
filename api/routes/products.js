const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find().exec().then(doc => {
        if (doc.length > 0) {
            res.status(200).json({message: 'Success', data: [...doc]})
        } else {
            res.status(404).json({message: 'No entries data', data: []})
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
});


router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product.save().then(doc => {
        console.log(doc);
        res.status(201).json({message: 'Success', product: product._id})
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(doc => {
        console.log(doc)
        if (doc) {
        res.status(200).json(doc)
        } else {
            res.status(404).json({message: `No valid entry ID ${id}`})
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });

})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findByIdAndUpdate({_id: id}, {$set: updateOps}).exec().then(result => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(404).json({message: 'Data not valid'});
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove({_id: id}).exec().then(doc => {
        if (doc) {
            res.status(200).json(doc)
        } else {
            res.status(404).json({message: `The entry data is not provided. ${id}`})
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
});

module.exports = router;