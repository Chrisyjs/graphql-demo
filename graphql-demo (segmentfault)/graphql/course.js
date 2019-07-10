import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    isOutputType,
    GraphQLInt
  } from 'graphql';

  import http from 'http';
  
  import mongoose from 'mongoose'
  const Course = mongoose.model('Course')
  
  const objType = new GraphQLObjectType({
    name: 'meta',
    fields: {
      createdAt: {
        type: GraphQLString
      },
      updatedAt: {
        type: GraphQLString
      }
    }
  })
  
  let CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: {
      _id: {
        type: GraphQLID
      },
      title: {
        type: GraphQLString
      },
      desc: {
        type: GraphQLString
      },
      page: {
        type: GraphQLInt
      },
      author: {
        type: new GraphQLList(GraphQLString)
      },
      meta: {
        type: objType
      }
    }
  })
  
  const testRestFulCourse = {
    type: new GraphQLList(CourseType),
    args: {},
    resolve(root, params, options) {
      return new Promise((resolve, reject) => {
        let req = http.request({
          hostname: 'localhost',
          port: 4001,
          path: '/course',
          method: 'GET'
        }, (res) => {
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            let result = JSON.parse(chunk);
            resolve(result.data);
          })
        })
        req.on('error', (e) => {
          reject(e.message);
        })
        req.end();
      })
    }
  }
  
  const course = {
    type: new GraphQLList(CourseType),
    args: {},
    resolve (root, params, options) {
      return Course.find({}).exec()
    }
  }

  export { course, CourseType, testRestFulCourse };