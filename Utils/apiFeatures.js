module.exports = class APIFeatures {
  constructor(entityQuery, reqQuery) {
    this.entityQuery = entityQuery;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery }; // harcoded copy, not just reference, for modify
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // how gte or similar filters: in mongoDB { rating: { $get: 8} }
    // express give us a query almost equal, without $ mongo operator, if we use in the url: ?rating[gte]=8
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.entityQuery = this.entityQuery.where(JSON.parse(queryStr));
    // return the entire object and then chain with others features
    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      // separated the values with commas, could be negative values for desc criteria
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.entityQuery = this.entityQuery.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.reqQuery.fields) {
      // negative value means exclusion instead desired fields
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.entityQuery = this.entityQuery.select(fields);
    }
    return this;
  }

  paginate() {
    // pagination, default value page=1 & limit=100
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const resultsSkipped = (page - 1) * limit;
    this.entityQuery = this.entityQuery.skip(resultsSkipped).limit(limit);
    return this;
  }
};
