import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB({apiVersion:'2012-08-10'})

async function getUsers(event) {
    let users;

    const params = {
        TableName: "users"
    }

    try {
        const result = await dynamodb.scan(params).promise()
        users = result.Items
    } catch (error) {
        console.log(error)
        return { statusCode: 400, body: "Error getting users"}
    }

    return { statusCode: 200, body: JSON.stringify(users) }
}

export const handler = getUsers