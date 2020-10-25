import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

async function updateUser(event) {
    const id = event.pathParameters.id
    const { given_name, last_name } = JSON.parse(event.body)

    const params = {
        Item: {
            id: {
                S: id
            },
            firstName: {
                S: given_name
            },
            lastName: {
                S: last_name
            }
        },
        TableName: "users"
    }

    try {
        const result = await dynamodb.putItem(params).promise()
    } catch (error) {
        console.log(error)
        return { statusCode: 400, body: "Error updating user with id " + id }
    }

    return { statusCode: 200, body: "Successfully updated user"}
}

export const handler = updateUser