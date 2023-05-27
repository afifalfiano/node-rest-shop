const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
// const upload = multer({dest: './uploads'})
const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, ('./uploads'))
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname.replace(/ /g, '-'));
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})

router.get('/', (req, res, next) => {
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
});


router.post('/', checkAuth, upload.single('productImage'),(req, res, next) => {
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
});

router.get('/:productId', (req, res, next) => {
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

})

router.patch('/:productId', checkAuth, (req, res, next) => {
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

router.delete('/:productId', checkAuth, (req, res, next) => {
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
});

module.exports = router;