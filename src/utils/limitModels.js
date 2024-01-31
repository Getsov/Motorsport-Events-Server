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
    const aggregationPipeline = [
      { $match: criteria }, // Match documents based on criteria
      {
        $addFields: {
          lastDate: {
            $cond: {
              if: { $ne: ['$dates', []] },
              then: { $arrayElemAt: ['$dates.date', -1] },
              else: null,
            },
          },
        },
      },
      { $sort: { lastDate: -1 } }, // Sort by the last date in descending order
      { $skip: startIndex },
    ];

    if (limit > 0) {
      aggregationPipeline.push({ $limit: limit });
    }

    models.results = await model.aggregate(aggregationPipeline).exec();
    return models;
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
