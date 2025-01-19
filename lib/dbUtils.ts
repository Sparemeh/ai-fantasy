import prismadb from './prismadb';

/**
 * Performs a full-text search on the "Character" table.
 * @param searchTerm The search term to query.
 * @returns Array of matching characters.
 */
export async function searchCharacters(searchTerm: string) {
  return await prismadb.$queryRaw`
    SELECT * 
    FROM "Character"
    WHERE to_tsvector('english', "name") @@ plainto_tsquery('english', ${searchTerm});
  `;
}
