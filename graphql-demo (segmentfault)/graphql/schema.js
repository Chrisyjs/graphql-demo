import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  isOutputType,
  GraphQLInt,
  GraphQLInputObjectType
  } from 'graphql';

  import http from 'http';
  
  import {info, infos} from './info'
  import {course, CourseType, testRestFulCourse} from './course'
  import {student, StudentType, mutationStudent, testRestFulStudent} from './student'

  /* 后端维持 restFul 接口，前端增加 graphql 层，这层发起请求 */
  const testRestful = {
    type: new GraphQLObjectType({
      name: 'testRestful',
      fields: {
        student: {
          type: new GraphQLList(StudentType),
        },
        course: {
          type: new GraphQLList(CourseType),
        }
      }
    }),
    description: 'testRestful',
    args: {},
    resolve (root, params, options) {
      let hostname = 'localhost',
          port = 4001,
          urls = ['/studentDetail', '/course'],
          allPromise = [];
      urls.map((item) => {
        allPromise.push(
          new Promise((resolve, reject) => {
            let req = http.request({
              hostname: hostname,
              port: port,
              path: item
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
        )
      })
      return Promise.all(allPromise).then((results) => {
        return new Promise((resolve, reject) => {
          resolve({
            student: results[0],
            course: results[1]
          });
        })
      });
    }
  }

  export default new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Queries',
      fields: {
        infos,
        info,
        course,
        student,
        testRestful,
        testRestFulStudent,
        testRestFulCourse
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutations',
      fields: () => ({
        ...mutationStudent
      })
    })
  })