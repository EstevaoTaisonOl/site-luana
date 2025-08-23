// app/api/login/route.js
import { generateToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(request) {
    const body = await request.json();

    // Validação básica
    if (!body.name || !body.password) {
        return Response.json(
            { error: "Todos os campos são obrigatórios." },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("siteLuana");
        const users = db.collection("users");

        // Busca usuário pelo nome
        const user = await users.findOne({ name: body.name });
        if (!user) {
            return Response.json({ error: "Usuário não encontrado." }, { status: 404 });
        }

        // Compara a senha
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return Response.json({ error: "Senha incorreta." }, { status: 401 });
        }

        // Sucesso
        var token = generateToken(user.uuid)
        console.log(token)
        return Response.json({
            message: "Login realizado com sucesso!",
            userId: user._id,
            name: user.name,
            code: user.code,
            uuid: user.uuid,
            token
        }, { status: 200 });
    } catch (err) {
        return Response.json(
            { error: "Erro no servidor: " + err.message },
            { status: 500 }
        );
    }
}
