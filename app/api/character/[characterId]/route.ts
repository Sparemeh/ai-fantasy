import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    context: { params:  { characterId: string } }
) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        const { characterId } = context.params;

        if (!characterId) {
            return new NextResponse("Companion ID is required", { status: 400});
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // TODO: Check for subscription

        const character = await prismadb.character.update({
            where: {
                id: characterId,
                userId: user.id,
            },
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        });

        return NextResponse.json(character);

    } catch (error) {
        console.log("[CHARACTER_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    context: { params: { characterId: string } }
) {
    try {
        const { characterId } = context.params;
        // Await the result of the `auth()` function
        const authResult = await auth();

        // Extract the userId from the auth result
        const userId = authResult?.userId;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const character = await prismadb.character.delete({
            where: {
                userId,
                id: characterId,
            }
        });

        return NextResponse.json(character);
    } catch (error) {
        console.log("[COMPANION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}