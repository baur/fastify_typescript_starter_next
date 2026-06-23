import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export interface TestItemsTable {
    id: Generated<number>
    slug: string
    name: string
    description: string | null
    is_active: ColumnType<boolean, boolean | undefined, boolean | undefined>
    created_at: ColumnType<Date, Date | string | undefined, Date | string>
    updated_at: ColumnType<Date, Date | string | undefined, Date | string>
}

export interface DB {
    test_items: TestItemsTable
}

export type TestItemRow = Selectable<TestItemsTable>
export type NewTestItemRow = Insertable<TestItemsTable>
export type TestItemUpdateRow = Updateable<TestItemsTable>
