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

function pagination(model, approved) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        delete req.query.page
        delete req.query.limit

        let queryKeys = Object.entries(req.query);
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

        console.log(filter);
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