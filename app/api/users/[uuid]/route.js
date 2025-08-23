import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
    try {
        const { uuid } = params;

        const client = await clientPromise;
        const db = client.db("siteLuana");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ uuid });

        if (!user) {
            return Response.json(
                { error: "Usuário não encontrado." },
                { status: 404 }
            );
        }

        return Response.json({ user }, { status: 200 });
    } catch (error) {
        return Response.json(
            { error: "Erro interno do servidor", details: error.message },
            { status: 500 }
        );
    }
}
