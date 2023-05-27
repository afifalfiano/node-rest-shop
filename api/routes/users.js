const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then(user => {
        if (user.length > 0) {
            return res.status(422).json({message: 'Email already used!'})
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })       
                    user.save().then(result => {
                        res.status(200).json({message: 'success created user'})
                    }).catch(err => {
                        res.status(500).json({error: err});
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    })
});

router.delete('/:userId', (req, res, next) => {
    User.findOneAndDelete({_id: req.params.userId}).then(result => {
        if (result) {
            res.status(200).json({message: 'success delete user'})
        }
    }).catch(err => {
        res.status(500).json({error: err})
    })
})


module.exports = router;