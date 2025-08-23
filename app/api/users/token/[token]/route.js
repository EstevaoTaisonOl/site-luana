import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
export async function GET(req, context) {
    try {
        const { token } = await context.params;

        if (!token) {
            return NextResponse.json(
                { valid: false, error: "Token não fornecido" },
                { status: 400 }
            );
        }

        const data = verifyToken(token); // função que você criou
        if (!data.valid) {
            return NextResponse.json(
                { valid: false, error: data.error },
                { status: 401 }
            );
        }

        return NextResponse.json({ valid: true, uuid: data.uuid });
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: "Erro interno do servidor", details: error.message },
            { status: 500 }
        );
    }
}
