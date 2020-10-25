import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

async function getUserById(event) {
  const id = event.pathParameters.id
  let user

  const params = {
    Key: {
      id: {
        S: id
      }
    },
    TableName: "users"
  }

  try {
    const result = await dynamodb.getItem(params).promise()
    user = result.Item
  } catch (error) {
    console.log(error)
    return { statusCode: 400, body: "Error getting user with id " + id }
  }
  

  if (!user) {
    return { statusCode: 404, body: "User with id " + id + " not found"}
  }

  return { statusCode: 200, body: JSON.stringify(user) }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

export const handler = getUserById
