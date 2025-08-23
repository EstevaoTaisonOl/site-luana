import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";


async function salvarCodigoTemporario(code, user, db) {
    const collection = db.collection("codes");

    // Cria TTL index (expira em 1 hora = 3600 segundos)
    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

    // Insere documento com createdAt
    await collection.insertOne({
        code,
        createdAt: new Date(),
        name: user,
        players: [user],
        maxPlayers: 2,
    });

    console.log("Código salvo:", code);
}


export async function POST(request) {
    const body = await request.json();
    if (!body.name) {
        return Response.json(
            { error: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }
    const client = await clientPromise;
    const db = client.db("siteLuana"); // nome do seu banco
    const users = db.collection("codes");
    const existingCode = await users.findOne({ name: body.name });
    if (existingCode) {
        return Response.json(
            {
                data: "Voce ja gerou um codigo, espere uma hora",
                code: existingCode.code
            },

            { status: 200 }
        );
    }

    var code = uuidv4()

    await salvarCodigoTemporario(code, body.name, db);

    return Response.json({
        code,
        data: "Código gerado com sucesso!",
        players: [body.name],
        maxPlayers: 2,
    }, { status: 200 });
}

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const name = url.searchParams.get("name");

    if (!code || !name) {
        return Response.json(
            { error: "Código ou nome não fornecido." },
            { status: 400 }
        );
    }

    const client = await clientPromise;
    const db = client.db("siteLuana");
    const collection = db.collection("codes");

    const codeData = await collection.findOne({ code });
    console.log("Código buscado:", code);
    console.log("Código encontrado:", codeData);

    if (!codeData) {
        return Response.json(
            { error: "Código não encontrado." },
            { status: 404 }
        );
    }

    // Verifica se o player já está na lista
    if (codeData.players && codeData.players.includes(name)) {
        return Response.json(
            { error: "Você já está nessa sala." },
            { status: 400 }
        );
    }

    // Adiciona o player ao array
    const updated = await collection.updateOne(
        { code },
        { $push: { players: name } } // adiciona ao array players
    );

    // Busca novamente para retornar o documento atualizado
    const updatedCodeData = await collection.findOne({ code });

    return Response.json(updatedCodeData, { status: 200 });
}
