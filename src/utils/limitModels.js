async function limitModels(model, page, limit, criteria, sortCriteria) {
  page = Number(page);
  limit = Number(limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const models = {};
  
  if (sortCriteria === 'allEvents') {
    let todayStart = new Date(Date.now());
    todayStart.setHours(0, 0, 0, 0);

    upcomingDates = {
      $elemMatch: {
        date: { $gte: todayStart },
      },
    };
    criteria.dates = upcomingDates;

    let upcomingEvents = await model
      .find(criteria)
      .sort({ 'dates.0.date': 1 })
      .exec();

    pastDates = {
      $not: {
        $elemMatch: {
          date: { $gte: todayStart },
        },
      },
    };
    criteria.dates = pastDates;

    const aggregationPipeline = [
      { $match: criteria },
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
      { $sort: { lastDate: -1 } },
      { $project: { lastDate: 0 } },
    ];

    let pastEvents = await model.aggregate(aggregationPipeline).exec();
    const concatenatedEvents = upcomingEvents.concat(pastEvents);

    if (endIndex < (concatenatedEvents.length) && limit) {
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
    if (limit) {
      models.results = concatenatedEvents.slice(startIndex, startIndex + limit);
      return models.results;
    }
    models.results = concatenatedEvents;
    return models.results;
  }
  
  if (sortCriteria === 'pastEvents') {
    const aggregationPipeline = [
      { $match: criteria },
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
      { $sort: { lastDate: -1 } },
      { $project: { lastDate: 0 } },
    ];

    const foundEvents = await model.aggregate(aggregationPipeline).exec();

    if (endIndex < (foundEvents.length) && limit) {
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
    
    if (limit) {
      models.results = foundEvents.slice(startIndex, startIndex + limit);
      return models.results;
    }
    // To discuss with the team whether they want model object or result array.
    models.results = foundEvents;
    return models.results;
  }
  
  if (sortCriteria === 'upcomingEvents') {
    const foundEvents = await model
    .find(criteria)
    .sort({ 'dates.0.date': 1 })
    .exec();
    
    if (endIndex < (foundEvents.length) && limit) {
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
  
    if (limit) {
      models.results = foundEvents.slice(startIndex, startIndex + limit);
      return models.results;
    }
    models.results = foundEvents;
    return models.results;
  }

}

module.exports = {
  limitModels,
};
