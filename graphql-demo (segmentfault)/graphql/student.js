
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
  
  import mongoose from 'mongoose'
  
  import {InfoType} from './info'
  const Student = mongoose.model('Student')
  
  
  let StudentType = new GraphQLObjectType({
    name: 'Student',
    fields: {
      _id: {
        type: GraphQLID
      },
      name: {
        type: GraphQLString
      },
      sex: {
        type: GraphQLString
      },
      age: {
        type: GraphQLInt
      },
      info: {
        type: InfoType
      }
    }
  })

  const student = {
    type: new GraphQLList(StudentType),
    args: {},
    resolve (root, params, options) {
      return Student.find({}).populate({
        path: 'info',
        select: 'hobby height weight'
      }).exec()
    }
  }

  const testRestFulStudent = {
    type: new GraphQLList(StudentType),
    args: {},
    resolve(root, params, options) {
      return new Promise((resolve, reject) => {
        let req = http.request({
          hostname: 'localhost',
          port: 4001,
          path: '/studentDetail',
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

  const mutationStudent = {
    updateStudent: {
      type: new GraphQLObjectType({
        name: 'output',
        fields: {
          _id: {
            type: GraphQLString
          },
          name: {
            type: GraphQLString
          },
          age: {
            type: GraphQLInt
          }
        }
      }),
      description: 'update',
      args: {
        _id: {
          type: GraphQLID
        },
        name: {
          type: GraphQLString
        },
        sex: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        },
        /* info: {
          type: InfoType
        } */
      },
      resolve: async (root, params, options) => {
        let temp = await Student.updateOne(params, (err, result) => {
          if (err) throw err
          return;
        }).then(() => {
          Student.findOne(params, (err, result) => {
            return(result);
          })
        })
        return {
          _id: params._id,
          name: params.name,
          age: params.age
        };
        // return temp;
      }
    }
  }

  export { student, mutationStudent, StudentType, testRestFulStudent }
  
  