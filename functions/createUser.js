import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
})

async function createUser(event, context, callback) {

    const { given_name, family_name, email } = event.request.userAttributes
    // Check if email already exists
    let itemsReturned;

    const searchParams = {
        TableName: process.env.USERS_TABLE,
        IndexName: "search_email",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": {
                S: email
            }
        }
    }

    try {
        const result = await dynamodb.query(searchParams).promise()
        console.log(result)
        itemsReturned = result.Count
    } catch (error) {
        console.log(error)
        callback(JSON.stringify({ statusCode: 400, body: "Error getting user with email " + email }), null)
    }

    if (itemsReturned > 0) {
        callback(JSON.stringify({ statusCode: 409, body: "User already exists with email " + email }), null)
    } else {
        // Create User
        const params = {
            Item: {
                "id": {
                    S: event.userName
                },
                "given_name": {
                    S: given_name
                },
                "family_name": {
                    S: family_name
                },
                "email": {
                    S: email
                },
            },
            TableName: process.env.USERS_TABLE
        }

        try {
            await dynamodb.putItem(params).promise()
        } catch (error) {
            console.log(error)
            callback(JSON.stringify({ statusCode: 400, body: "Error creating user" }), null)
        }
        callback(null, event)
    }
}

export const handler = createUser