async function limitModels(model, page, limit) {
    page = Number(page);
    limit = Number(limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const models = {};

    if (!page && !limit) {
        return await model.find({ isDeleted: false });
    }

    if (endIndex < await model.countDocuments({ isDeleted: false }).exec()) {
        models.nextPage = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        models.previousPage = {
            page: page - 1,
            limit: limit
        }
    }

    models.results = await model.find({ isDeleted: false }).limit(limit).skip(startIndex).exec();
    return models;
}

module.exports = {
    limitModels
}