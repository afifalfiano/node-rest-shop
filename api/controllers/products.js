

const Product = require('../models/products');
const mongoose = require('mongoose');
exports.get_all_product = (req, res, next) => {
    Product.find().select('name price _id productImage').exec().then(doc => {
        if (doc.length > 0) {
            res.status(200).json({message: 'Success', count: doc.length, data: doc.map(item => {
                return {
                    name: item.name,
                    price: item.price,
                    _id: item._id,
                    productImage: item.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + item._id
                    }
                }
            })})
        } else {
            res.status(404).json({message: 'No entries data', count: doc.length, data: []})
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
}

exports.create_product = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(doc => {
        res.status(201).json({message: 'Success', product: product._id})
    }).catch(err => {
        res.status(500).json({error: err})
    });
}

exports.get_detail_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage').exec().then(doc => {
        if (doc) {
        res.status(200).json({product: doc, request: {
            type: 'GET',
            desciption: 'Get All products',
            url: 'http://localhost:3000/products'
        }})
        } else {
            res.status(404).json({message: `No valid entry ID ${id}`})
        }
    }).catch(err => {
        res.status(500).json({error: err})
    });

}

exports.update_product = (req, res, next) => {
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
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove({_id: id}).exec().then(doc => {
        if (doc) {
            res.status(200).json({message: `Success delete data with id ${id}`})
        } else {
            res.status(404).json({message: `The entry data is not provided. ${id}`})
        }
    }).catch(err => {
        res.status(500).json({error: err});
    })
}