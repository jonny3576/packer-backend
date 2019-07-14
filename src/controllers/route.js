"use strict";

const RouteModel = require('../models/Route');
const internalServerError = require('./ErrorHandler').internalServerError;

const list = (req, res) => {
    RouteModel.find({}).exec()
        .then(routes => res.status(200).json(routes))
        .catch(error => internalServerError(error, res));
};

const listByDate = (req, res) => {
    RouteModel.find().byDate(req.params["date"]).exec()
        .then(routes => res.status(200).json(routes))
        .catch(error => internalServerError(error, res));
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
        .catch(error => internalServerError(error, res));

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
        .catch((error) => internalServerError(error, res));
};
const updateBid = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }
    RouteModel.findByIdAndUpdate(req.params.id, {
        $push: {
            auctionBids: {
                "owner": req.body.owner,
                "bid": req.body.bid,
                "timestamp": new Date()
            }
        },
        currentBid: req.body.bid
    }, {new: true, runValidators: true}).exec()
        .then(route => {
            res.status(200).json(route);
        })
        .catch((error) => internalServerError(error, res));
};


module.exports = {
    list,
    listByDate,
    read,
    update,
    updateBid
};