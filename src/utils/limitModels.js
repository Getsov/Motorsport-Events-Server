async function limitModels(model, page, limit, criteria) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const models = {};

    if (!page && !limit) {
        return await model.find(criteria);
    }

    if (endIndex < (await model.countDocuments(criteria).exec())) {
        models.nextPage = {
            page: page + 1,
            limit: limit,
        };
    }

    if (startIndex > 0) {
        models.previousPage = {
            page: page - 1,
            limit: limit,
        };
    }

    models.results = await model
        .find(criteria)
        .limit(limit)
        .skip(startIndex)
        .exec();
    return models;
}

module.exports = {
    limitModels,
};
