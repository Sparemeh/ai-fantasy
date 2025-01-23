import { Categories } from "@/components/categories";
import { Characters } from "@/components/characters";
import { SearchInput } from "@/components/search-input";
import { searchCharacters } from '@/lib/dbUtils';
import prismadb from "@/lib/prismadb";

interface RootPageProps {
    searchParams: {
        categoryId?: string; // Made optional to handle undefined cases
        name?: string;       // Made optional for similar reasons
    }
}

const RootPage = async ({ searchParams }: RootPageProps) => {
    // Extract categoryId and name
    const categoryId = searchParams?.categoryId || undefined;
    const name = searchParams?.name || undefined;

    const data = await prismadb.character.findMany({
        where: {
            categoryId: categoryId,
            name: name ? { search: name } : undefined, // Handle optional name filtering
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    messages: true
                }
            }
        }

    })


    const categories = await prismadb.category.findMany();
    return ( 
        <div className="h-full p-4 space-y-2">
            <SearchInput/>
            <Categories data={categories}/>
            <Characters data={data} />
        </div>
    );
}
 
export default RootPage;