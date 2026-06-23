import type { Kysely } from "kysely"
import type { DB, TestItemRow } from "#database/db.d.js"

export interface TestItemModel {
    id: number
    slug: string
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export class TestItemsService {
    constructor(private readonly db: Kysely<DB>) {}

    async list(): Promise<TestItemModel[]> {
        const rows = await this.db.selectFrom("test_items").selectAll().orderBy("id", "asc").execute()

        return rows.map((row) => this.toModel(row))
    }

    private toModel(row: TestItemRow): TestItemModel {
        return {
            id: row.id,
            slug: row.slug,
            name: row.name,
            description: row.description,
            isActive: row.is_active,
            createdAt: row.created_at.toISOString(),
            updatedAt: row.updated_at.toISOString(),
        }
    }
}
