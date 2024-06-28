import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import * as DynamoDb from "aws-sdk/clients/dynamodb";
import * as z from "zod";

const payloadSchema = z.object({
    email: z.string().email({ message: "Invalid email address" },)
});

const tableName = process.env.DYNAMODB_TABLE as string;

const parseBody = (body: string): unknown | undefined => {
    try {
        return JSON.parse(body);
    } catch {
        return undefined;
    }
}

const response = (result: APIGatewayProxyResult): APIGatewayProxyResult => ({
    ...result,
    headers: {
        ...(result.headers || {}),
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }
});

const handler: APIGatewayProxyHandler = async (event) => {
    const body = event.body;
    if (!body) {
        return response({ statusCode: 400, body: "No payload provided" });
    }
    const parsedBody = parseBody(body);
    if (!parsedBody) {
        return response({ statusCode: 400, body: "Invalid JSON payload" });
    }
    const validation = payloadSchema.safeParse(parsedBody);
    if (validation.success) {
        const { email } = validation.data;
        await new DynamoDb.DocumentClient().put({
            Item: {
                email,
                status: "subscribed"
            },
            TableName: tableName
        }).promise();
        return response({ statusCode: 201, body: "OK" });
    } else {
        return response({ statusCode: 400, body: validation.error.message });
    }
};

export default handler;