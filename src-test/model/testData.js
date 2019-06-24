const model = require('../../src/models/dataModel');

const handleErr = function (err) {
    console.log(err);
    process.exit(1);
};


const executeTest = function () {

    //add deliveryGood
    const dishwasher = new model.deliveryGood({
        name: "Dishwasher",
        deliveryDate: new Date(2019, 9, 18),
        weight: 80,
        size: 3,
        price: 28,
        deliveryState: "Waiting for Routing",
        destination: {
            city: "Muenchen",
            street: "Theresienstrasse",
            houseNumber: 5,
            postalCode: "84762"
        },
        origination: {
            city: "München",
            street: "Arcisstrasse",
            houseNumber: "28",
            postalCode: "86361"
        }
    });
    dishwasher.save().then(function (delGood) {
        //add delivery client
        const dishwasherClient = new model.deliveryClient({});
        dishwasherClient.goodsToDeliver = delGood._id;
        dishwasherClient.save().then(function (client) {
            const delClient = new model.user({
                name: "Max",
                lastName: "Mustermann",
                birthday: new Date('1995-12-17T03:24:00'),
                homeAddress: {
                    city: "Muenchen",
                    street: "Luitpoldstrasse",
                    houseNumber: 1,
                    postalCode: "81554"
                }
            });
            delClient.deliveryClient = client._id;
            return delClient.save();
        }).then(() => {
            model.deliveryClient.find().then((goods) => {
                console.log(goods);
            }).catch(handleErr);
        }).catch(handleErr);
    }).catch(handleErr);


    //add deliveryGood
    const bike = new model.deliveryGood({
        name: "Bike",
        deliveryDate: new Date(2019,6,24),
        weight: 50,
        size: 3,
        price: 30,
        deliveryState: "Waiting for Routing",
        destination: {
            city: "Muenchen",
            street: "Implerstraße",
            houseNumber: 14,
            postalCode: "81371"
        },
        origination: {
            city: "München",
            street: "Odeonsplatz",
            houseNumber: "28",
            postalCode: "86361"
        }
    });
    bike.save().then( function(delGood) {
        //add delivery client
        const bikeClient = new model.deliveryClient({});
        bikeClient.goodsToDeliver = delGood._id;
        bikeClient.save().then(function (client) {
            const delClient = new model.user({
                name: "Jonas",
                lastName: "Ebel",
                birthday: new Date('1995-05-17T03:24:00'),
                homeAddress: {
                    city: "Muenchen",
                    street: "Moosacher Straße",
                    houseNumber: 1,
                    postalCode: "81554"
                }
            });
            delClient.deliveryClient = client._id;
            return delClient.save();
        }).then(() => {
            model.deliveryClient.find().then((goods) => {
                console.log(goods);
            }).catch(handleErr);
        }).catch(handleErr);
    }).catch(handleErr);

    //add vehicle
    const vehicle = new model.vehicle({
        maxDistance: 10,
        maxSize: 15,
        maxItems: 8
    });
    vehicle.save().then(function (veh) {
        const driver = new model.driver({driverLicenseNumber: "abcde12345", isAvailable: true, vehicle: veh._id});
        driver.save().then(function (driv) {
            const seppDriver = new model.user({
                name: "Sepp",
                lastName: "Müller",
                birthday: new Date('1995-05-08T03:24:00'),
                homeAddress: {
                    city: "Muenchen",
                    street: "Implerstraße",
                    houseNumber: 1,
                    postalCode: "81371"
                }
            });
            seppDriver.driver = driv._id;
            seppDriver.save().then(function (seppUser) {
                const route = new model.route({
                    kilometers: 10,
                    estimatedArrivalTimes: [new Date('2019-06-20T03:24:00')],
                    items: [dishwasher, bike],
                    auctionBids: [{
                        owner: driver._id,
                        bid: 4,
                        timestamp: new Date('2019-06-19T03:24:00')
                    }]
                });
                return route.save();
            }).then(() => {
                model.route.find().then((goods) => {
                    console.log(goods);
                }).catch(handleErr);
            }).catch(handleErr);

        }).catch(handleErr);
    }).catch(handleErr);

    (function createADifferentRoute() {
        const presentItem = new model.deliveryGood({
            name: "Present",
            weight: 20,
            size: 2,
            price: 10,
            deliveryState: "Routed",
            destination: {
                city: "Muenchen",
                street: "Fraunhoferstraße",
                houseNumber: 12,
                postalCode: "84762"
            },
            origination: {
                city: "München",
                street: "Balanstraße",
                houseNumber: "29",
                postalCode: "85794"
            }
        });
        const ornament = new model.deliveryGood({
            name: "Ornament",
            weight: 1,
            size: 1,
            price: 5,
            deliveryState: "Routed",
            destination: {
                city: "Muenchen",
                street: "Gärtnerplatz",
                houseNumber: 2,
                postalCode: "84762"
            },
            origination: {
                city: "München",
                street: "Ungererstraße",
                houseNumber: "28",
                postalCode: "86361"
            }
        });
        const books = new model.deliveryGood({
            name: "Books",
            weight: 20,
            size: 4,
            price: 15,
            deliveryState: "Routed",
            destination: {
                city: "Muenchen",
                street: "Silberhornstra0e",
                houseNumber: 5,
                postalCode: "84762"
            },
            origination: {
                city: "München",
                street: "Kolumbusplatz",
                houseNumber: "28",
                postalCode: "86361"
            }
        });
        presentItem.save().then(() => {
            return ornament.save();
        }).then(() => {
            return books.save();
        }).catch(handleErr);
        const vehicle = new model.vehicle({
            maxDistance: 40,
            maxSize: 30,
            maxItems: 20
        });

        vehicle.save().then(function (veh) {
            const driver2 = new model.driver({
                driverLicenseNumber: "urwefij2q89urhiufhv",
                isAvailable: true,
                vehicle: veh._id
            });
            return driver2.save().then(function (driv) {
                const maxl = new model.user({
                    name: "Maxl",
                    lastName: "Rainer",
                    birthday: new Date('1953-02-18'),
                    homeAddress: {
                        city: "Muenchen",
                        street: "Kolumbusplatz",
                        houseNumber: 1,
                        postalCode: "81371"
                    }
                });
                maxl.driver = driver2._id;
                return maxl.save().then(function (maxl) {
                    const route = new model.route({
                        kilometers: 20,
                        date: "2019-06-24",
                        estimatedArrivalTimes: [new Date('2019-06-24T20:24:00')],
                        items: [presentItem, books, ornament],
                        auctionBids: [{
                            owner: driver2._id,
                            bid: 30,
                            timestamp: new Date('2019-06-24T16:00:00')
                        }, { // TODO Add one drive that bids inbetween
                            owner: driver2._id,
                            bid: 23,
                            timestamp: new Date('2019-06-24T17:01:00')
                        }]
                    });
                    return route.save();
                }).then(() => {
                    model.route.find().then((goods) => {
                        console.log(goods);
                    });
                });

            });
        }).catch(handleErr);
    })();

};

module.exports = executeTest;