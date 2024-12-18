import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DB;

export async function GET() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const result = await db.collection('favorite_recipes').find({}).toArray();

        return new Response(JSON.stringify({ favorites: result }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch favorites' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        await client.connect();
        const db = client.db(dbName);

        const createdFavorite = {
            _id: body.idMeal,
            recipeId: body.idMeal,
            recipeName: body.strMeal,
            imageURL: body.strMealThumb,
        };

        const existingFavorite = await db.collection('favorite_recipes').findOne({ _id: createdFavorite._id });
        if (existingFavorite) {
            return new Response(
                JSON.stringify({ error: 'Favorite already exists', favorite: existingFavorite }),
                { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const result = await db.collection('favorite_recipes').insertOne(createdFavorite);

        return new Response(JSON.stringify({ favorite: createdFavorite }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to save favorite' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}