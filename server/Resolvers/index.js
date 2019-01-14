const { mergeResolvers } = require("merge-graphql-schemas");
const questionResolvers = require("./questionResolver");

const resolversList = [questionResolvers];
const resolvers = mergeResolvers(resolversList);

module.exports = resolvers;
