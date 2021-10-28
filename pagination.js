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


// Ideally I would come back and implement a better, more generic 

function paginatedFilteredResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        Object.keys(req.query).forEach((key, value) => {
            req.query[key] === undefined && delete req.query[key];
            if (req.query[key] === "<_10_Pounds") { req.query[key] = "< 10"}
            else if (req.query[key] === ">_10_<_25_Pounds") { req.query[key] = "> 10, < 25"; }
            else if (req.query[key] === ">_25_<_50_Pounds") { req.query[key] = "> 25, < 50"; }
            else if (req.query[key] === ">_50_Pounds") { req.query[key] = "> 50"; }
            delete req.query.page;
            delete req.query.limit;
        });

        console.log(req.query);
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
            results.results = await model.find(req.query).sort({'createdAt': -1}).exec();
            results.results = results.results.slice(startIndex, endIndex);
            res.paginatedResults = results;
            next();
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = { paginatedResults, paginatedFilteredResults };