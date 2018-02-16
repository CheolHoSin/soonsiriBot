const nullChecker = require('../utils/nullChecker')
const Food = require('../models/food')

// This function sample one food tagged by 'tags' and returns a promise object: resolve(food)
function sampleOne(tags, excepts) {
  const include = !nullChecker.isNullArray(tags)
  const except = !nullChecker.isNullArray(excepts)

  if (include) {
    if (except) {
      return Food.aggregate([
        { $match: {$and: [{tags: {$all: tags}}, {tags: {$not: {$in: excepts}}}]} },
        { $sample: {size: 1} }
      ]);
    } else {
      return Food.aggregate([
        { $match: {tags: {$all: tags}} },
        { $sample: {size: 1} }
      ]);
    }
  } else {
    if (except) {
      return Food.aggregate([
        { $match: {tags: {$not: {$in: excepts}}}},
        { $sample: {size: 1}}
      ])
    } else {
      return Food.aggregate([
        { $match: {tags: {$not: {$all: []}}}},
        { $sample: {size: 1}}
      ])
    }
  }
}

// This function remove collection and all documents in it.
function dropCollection() {
  return Food.remove()
}

// This function inserts foods all
function insertAll(foods) {
  return Food.create(foods)
}


exports.sampleOne = sampleOne
exports.dropCollection = dropCollection
exports.insertAll = insertAll
