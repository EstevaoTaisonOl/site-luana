import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
    try {
        const { uuid } = params;

        const client = await clientPromise;
        const db = client.db("siteLuana");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne(
            { uuid },
            { projection: { password: 0, _id: 0 } } // evita retornar senha/_id
        );

        if (!user) {
            return Response.json(
                { error: "Usuário não encontrado." },
                { status: 404 }
            );
        }

        const miss = {
            sended: user?.miss?.sended ?? 0,
            lastDate: user?.miss?.lastDate ?? null,
        };

        return Response.json({ saudade: miss }, { status: 200 });
    } catch (error) {
        return Response.json(
            { error: "Erro interno do servidor", details: error.message },
            { status: 500 }
        );
    }
}
