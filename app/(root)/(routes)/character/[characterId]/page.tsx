import prismadb from "@/lib/prismadb";
import { CharacterForm } from "./components/character-form";
import { auth } from "@clerk/nextjs/server";

interface CharacterIdPageProps {
    params: {
        characterId: string;
    };
};



const CharacterIdPage = async ({
    params
}: CharacterIdPageProps) => {
    const { userId, redirectToSignIn } = await auth();
    // TODO: Check Subscription

    

    if (!userId) {
        return redirectToSignIn();
    }

    const character = await prismadb.character.findUnique({
        where: {
            id: params.characterId,
            userId
        }
    });

    const categories = await prismadb.category.findMany();

    return (  
        <CharacterForm initialData={character} categories={categories}/>
    );
}
 
export default CharacterIdPage;