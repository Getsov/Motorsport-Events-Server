async function limitModels(model, page, limit, criteria, sortCriteria) {
  page = Number(page);
  limit = Number(limit);

  if (page === 0) page = 1;

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

  if (sortCriteria === 'pastEvents') {
    models.results = await model
    .find(criteria)
    .sort(sortCriteria)
    .limit(limit)
    .skip(startIndex)
    .exec();
    async function sortModels(models) {
      return models.results.sort((a, b) => b.dates.slice(-1)[0].date -  a.dates.slice(-1)[0].date)
    }
    return await sortModels(models);
  }

  models.results = await model
    .find(criteria)
    .sort(sortCriteria)
    .limit(limit)
    .skip(startIndex)
    .exec();

  return models;
}

module.exports = {
  limitModels,
};
