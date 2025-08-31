import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try {
        const { uuid } = await req.json();

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

        const updatedUser = await usersCollection.findOneAndUpdate(
            { uuid },
            {
                $inc: { "miss.sended": 1 }, // incrementa contador
                $set: { "miss.lastDate": new Date() } // atualiza data
            },
            { returnDocument: "after" }
        );

        return Response.json({ saudades: updatedUser.miss.sended, lastDate: updatedUser.miss.lastDate }, { status: 200 });
    } catch (error) {
        return Response.json(
            { error: "Erro interno do servidor", details: error.message },
            { status: 500 }
        );
    }
}



export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("siteLuana");
        const usersCollection = db.collection("users");

        const users = await usersCollection
            .find({}, { projection: { password: 0, uuid: 0, _id: 0 } }) // exclui dados sensíveis
            .sort({ "miss.sended": -1 })
            .toArray();

        // Garante que todos tenham miss.sended e miss.lastDate
        const usersWithMiss = users.map(user => ({
            ...user,
            miss: {
                sended: user?.miss?.sended ?? 0,
                lastDate: user?.miss?.lastDate ?? null
            }
        }));

        return Response.json({ ranking: usersWithMiss }, { status: 200 });
    } catch (error) {
        return Response.json(
            { error: "Erro interno do servidor", details: error.message },
            { status: 500 }
        );
    }
}


