"use strict";

const RouteModel = require('../models/Route');
const UserModel = require('../models/User');
const DeliveryGoodModel = require('../models/DeliveryGood');
const mongoose = require('mongoose');
const ErrorHandler = require("./ErrorHandler");

const listOfToday = (req, res) => {
    RouteModel
        .find().byDate(
        new Date(
            Date.UTC(
                new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(),
                12, 0, 0, 0)))
        .exec()
        .then(routes => res.status(200).json(routes))
        .catch(error => ErrorHandler.internalServerError(error, res));
};

const read = (req, res) => {
    RouteModel.findById(req.params.id).exec()
        .then(route => {

            if (!route) return res.status(404).json({
                error: 'Not Found',
                message: `Delivery good not found`
            });

            res.status(200).json(route)

        })
        .catch(error => ErrorHandler.internalServerError(error, res));

};

const update = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    RouteModel.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true
        }).exec()
        .then(route => {
            res.status(200).json(route);
            console.log(req.body);
        })
        .catch((error) => ErrorHandler.internalServerError(error, res));
};
const updateBid = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }
    UserModel.findById(req.userId).exec().then(user => {
            let driverID = user.driver;
            RouteModel.findByIdAndUpdate(req.params.id, {
                $push: {
                    auctionBids: {
                        "owner": mongoose.Types.ObjectId(driverID),
                        "bid": req.body.bid,
                        "timestamp": new Date()
                    }
                },
                currentBid: req.body.bid
            }).exec()
                .then(route => {
                    res.status(200).json(route);
                })
                .catch((error) => ErrorHandler.internalServerError(error, res));
        }
    ).catch(err => ErrorHandler.internalServerError(err));
};
const startDriving = (req, res) => {
    UserModel.findById(req.userId).exec().then(user => {
        let driverID = user.driver;
        //TODO: Validate that this user has this id.

        return RouteModel.findById(req.params.id).then(route =>
            DeliveryGoodModel.updateMany({_id: {$in: route.items.map(item => item._id)}}, {deliveryState:"In Delivery"})
        ).then(() =>  res.status(200).json({}));
    }).catch(err => ErrorHandler.internalServerError(err));
};


module.exports = {
    listOfToday,
    read,
    update,
    updateBid,
    startDriving
};