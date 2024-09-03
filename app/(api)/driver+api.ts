import { neon } from "@neondatabase/serverless";

export async function GET() {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const data = await sql`SELECT * FROM drivers`;
        
        return Response.json({ data });
    } catch (error) {
        console.log(error);
        return Response.json({ error });
    }
}