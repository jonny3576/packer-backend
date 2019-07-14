"use strict";
const mongoose = require('mongoose');
const config = require('./src/config.js');
const model = require('./src/models/dataModel');


console.log("%       Starting Auction Finisher      %");
const buildingDate = process.argv[2] ? new Date(process.argv[2]) : new Date();
console.log("%                                      %");
console.log("%  Build Route For: " + buildingDate.toDateString() + " %");
console.log("%       Starting Auction Finisher      %");


(async function () {
    await mongoose.connect(config.mongoURI, {useNewUrlParser: true});
    const allRoutes = await model.route.find().byDate(buildingDate);
    console.log("%      found " + allRoutes.length + " routes    %");

    let deliveryGoodIDs = [];
    allRoutes.forEach(async function(route) {
        deliveryGoodIDs = deliveryGoodIDs.concat(route.items.map(item => item._id));
    });
    await model.deliveryGood.updateMany({_id: {$in: deliveryGoodIDs}}, {deliveryState: 'Waiting for Pickup'});
    console.log("%       Updated Item's state        %")

    await model.route.updateMany({_id: {$in: allRoutes}}, {auctionOver: true});
    console.log("%       Updated Routes state        %")
    await model.route.updateMany({_id: {$in: allRoutes}}, {"items.$[].deliveryState": 'Waiting for Pickup'});
    console.log("%       Updated items state in route        %")
})()
    .then(() => {
        console.log("%Successfully executed Auction Finisher %");
        process.exit(0);
    })
    .catch((err) => {
        console.log("%Error occured when executing Auction Finisher. Stacktrace attached.%");
        console.log(err);
        process.exit(-1);
    });