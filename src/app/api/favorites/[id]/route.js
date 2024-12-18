import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DB;

export async function DELETE(request, { params }) {
    const { id } = (await params); 
    try {
        await client.connect();
        const db = client.db(dbName);

        const result = await db.collection('favorite_recipes').deleteOne({ recipeId: id });

        if (result.deletedCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Favorite not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(JSON.stringify({ message: 'Favorite deleted successfully' }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete favorite' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } finally {
        await client.close();
    }
}
