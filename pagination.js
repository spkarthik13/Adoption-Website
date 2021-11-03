const { parse } = require("dotenv");
const { query } = require("express");
const path = require('path');

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        
        let startIndex = (page - 1) * limit; // As the page increases, we want to increase the start of the array splice from the database.
        if (startIndex < 0) { startIndex = 0 };
        const endIndex = page * limit; // Upper end of the array splice.

        const results = {};

        results.next = {
                page: page + 1,
                limit: limit
        }

        results.previous = {
            page: page - 1,
            limit: limit
        }
    
        try {
            results.results = await model.find().sort({'createdAt': -1}).exec();
            results.results = results.results.slice(startIndex, endIndex);
            res.paginatedResults = results;
            next();
        } catch (e) {
            console.log(e);
        }
    }
}

// function paginatedFilteredResults(model, approved) {
//     return async (req, res, next) => {
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);
//         delete req.query.page;
//         delete req.query.limit; 

//         let lowerWeightArray = new Array;
//         let upperWeightArray = new Array;
//         if (req.query['wll'] !== undefined) {
//             if (typeof req.query['wll'] === 'string') {
//                 lowerWeightArray.push(parseInt(req.query['wll']))
//                 upperWeightArray.push(parseInt(req.query['wul']))
//             } else {
//             req.query['wll'].forEach((x) => 
//                 lowerWeightArray.push(parseInt(x))
//             )
//             req.query['wul'].forEach((x) => 
//                 upperWeightArray.push(parseInt(x))
//             )
//         }}
//         let lowestWeight = Math.min(...lowerWeightArray);
//         let highestWeight = Math.max(...upperWeightArray);
        
//         let lowerAgeArray = new Array;
//         let upperAgeArray = new Array;
//         if (req.query['all'] !== undefined) {
//             if (typeof req.query['all'] === 'string') {
//                 lowerAgeArray.push(parseInt(req.query['all']))
//                 upperAgeArray.push(parseInt(req.query['aul']))
//             } else {
//             req.query['all'].forEach((x) => 
//                 lowerAgeArray.push(parseInt(x))
//             )
//             req.query['aul'].forEach((x) => 
//                 upperAgeArray.push(parseInt(x))
//             )
//         }}
//         let lowestAge = Math.min(...lowerAgeArray);
//         let highestAge = Math.max(...upperAgeArray);
        
//         let filter = {
//             'inventoryApproved': approved
//         }
 
//         for (let i = 0; i < Object.keys(req.query).length; i++) {
//             if (Object.keys(req.query)[i] === 'wll' || Object.keys(req.query)[i] === 'wul') {
//                 filter['weight'] = { $gte: lowestWeight,  $lte: highestWeight };
//             } else if (Object.keys(req.query)[i] === 'all' || Object.keys(req.query)[i] === 'aul') {
//                 filter['age'] = { $gte: lowestAge,  $lte: highestAge };
//             } else {
//                 filter[Object.keys(req.query)[i]] = req.query[Object.keys(req.query)[i]];
//             }
//         }
        
//         let startIndex = (page - 1) * limit; // As the page increases, we want to increase the start of the array splice from the database.
//         if (startIndex < 0) { startIndex = 0 };
//         const endIndex = page * limit; // Upper end of the array splice.

//         const results = {};
//         results.next = { page: page + 1, limit: limit }
//         results.previous = { page: page - 1, limit: limit }

//         try {
//             results.results = await model.find(filter).sort({'createdAt': -1}).exec();
//             results.results = results.results.slice(startIndex, endIndex);
//             res.paginatedResults = results;
//             next();
//         } catch (e) {
//             console.log(e);
//         }
//     }
// }

// function pagSearchFilteredResults(model, approved) {
//     return async (req, res, next) => {
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);
//         delete req.query.page;
//         delete req.query.limit; 

//         let lowerWeightArray = new Array;
//         let upperWeightArray = new Array;
//         if (req.query['wll'] !== undefined) {
//             if (typeof req.query['wll'] === 'string') {
//                 lowerWeightArray.push(parseInt(req.query['wll']))
//                 upperWeightArray.push(parseInt(req.query['wul']))
//             } else {
//             req.query['wll'].forEach((x) => 
//                 lowerWeightArray.push(parseInt(x))
//             )
//             req.query['wul'].forEach((x) => 
//                 upperWeightArray.push(parseInt(x))
//             )
//         }}
//         let lowestWeight = Math.min(...lowerWeightArray);
//         let highestWeight = Math.max(...upperWeightArray);
        
//         let lowerAgeArray = new Array;
//         let upperAgeArray = new Array;
//         if (req.query['all'] !== undefined) {
//             if (typeof req.query['all'] === 'string') {
//                 lowerAgeArray.push(parseInt(req.query['all']))
//                 upperAgeArray.push(parseInt(req.query['aul']))
//             } else {
//             req.query['all'].forEach((x) => 
//                 lowerAgeArray.push(parseInt(x))
//             )
//             req.query['aul'].forEach((x) => 
//                 upperAgeArray.push(parseInt(x))
//             )
//         }}
//         let lowestAge = Math.min(...lowerAgeArray);
//         let highestAge = Math.max(...upperAgeArray);
        

//         let filter = {
//             'inventoryApproved': approved,
//         }
 
//         for (let i = 0; i < Object.keys(req.query).length; i++) {
//             if (Object.keys(req.query)[i] === 'wll' || Object.keys(req.query)[i] === 'wul') {
//                 filter['weight'] = { $gte: lowestWeight,  $lte: highestWeight };
//             } else if (Object.keys(req.query)[i] === 'all' || Object.keys(req.query)[i] === 'aul') {
//                 filter['age'] = { $gte: lowestAge,  $lte: highestAge } 
//             } else {
//                 filter[Object.keys(req.query)[i]] = req.query[Object.keys(req.query)[i]];
//             }
//         }
        
//         let startIndex = (page - 1) * limit; // As the page increases, we want to increase the start of the array splice from the database.
//         if (startIndex < 0) { startIndex = 0 };
//         const endIndex = page * limit; // Upper end of the array splice.

//         const results = {};
//         results.next = { page: page + 1, limit: limit }
//         results.previous = { page: page - 1, limit: limit }

//         try {
//             results.results = await model.find(filter).sort({'createdAt': -1}).exec();
//             results.results = results.results.slice(startIndex, endIndex);
//             res.paginatedResults = results;
//             next();
//         } catch (e) {
//             console.log(e);
//         }
//     }
// }

function pagination(model, approved) {
    return async (req, res, next) => {
        let queryKeys = Object.entries(req.query);
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        filter = {};

        let startIndex = (page - 1) * limit; // As the page increases, we want to increase the start of the array splice from the database.
        if (startIndex < 0) { startIndex = 0 };
        const endIndex = page * limit; // Upper end of the array splice.

        const results = {};
        results.next = { page: page + 1, limit: limit }
        results.previous = { page: page - 1, limit: limit }
        
        if (req.query.nameSearch) {
            results.results = await model.find({ name: { '$regex': req.query.nameSearch, '$options': "i" }}).sort({'createdAt': -1}).exec();
            results.results = results.results.slice(startIndex, endIndex);
            res.paginatedResults = results;
            next();
        } else {
        queryKeys.splice(queryKeys.indexOf('page'), 1);
        queryKeys.splice(queryKeys.indexOf('index'), 1);

        let lowWeight, highWeight, lowAge, highAge;
        queryKeys.forEach((key, value) => {
            if (key[0] === 'wll' || key[0] === 'all') {
                key[1] = parseInt(key[1]);
                console.log(key[1]);
                if (key[0] === 'all') {
                    if (key[1] !== undefined) {
                        lowAge = key[1];
                    } 
                } else {
                    if (key[1] !== undefined) {
                        lowWeight = key[1];
                    }
                }
            } else if (key[0] === 'wul' || key[0] === 'aul') {
                key[1] = parseInt(key[1]);
                if (key[0] === 'aul') {
                    if (key[1] !== undefined) {
                        highAge = key[1];
                    }
                } else {
                    if (key[1] !== undefined) {
                        highWeight = key[1];
                    }
                }
            } else if (key[0] === 'nameSearch') {
                filter['name'] = { '$regex': key[1], '$options': "i" };
            } else {
                filter[key[0]] = key[1];
            }
        })
        
        if (lowWeight !== undefined && highWeight !== undefined) {
            filter['weight'] = { $gte: lowWeight, $lte: highWeight};
        }
        if (lowAge !== undefined && highAge !== undefined) {
            filter['age'] = { $gte: lowAge, $lte: highAge}
        }
        filter['inventoryApproved'] = approved;

        try {
            results.results = await model.find(filter).sort({'createdAt': -1}).exec();
            results.results = results.results.slice(startIndex, endIndex);
            res.paginatedResults = results;
            next();
        } catch (e) {
            console.log(e);
        }
    }
}}
module.exports = { paginatedResults, pagination };