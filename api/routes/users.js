const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/signin', (req, res, next) => {
    console.log(req)
    User.find({email: req.body.email}).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({message: 'Auth failed'});
        }
        bcrypt.compare(req.body.password, user[0].password, (err, response) => {
            if (err) {
                return res.status(401).json({message: 'Auth failed'}); 
            }

            if (response) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0].id,

                }, process.env.JWT_KEY, {
                    expiresIn: "1h",

                })
                return res.status(200).json({message: 'Auth successful', token});
            }
        })
    }).catch(err => {
        res.status(500).json({error: err})
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