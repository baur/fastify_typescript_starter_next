export const parseNumber = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseInt(value.trim(), 10)
    return Number.isNaN(parsed) ? defaultValue : parsed
}

export const parseDecimal = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseFloat(value.trim())
    return Number.isNaN(parsed) ? defaultValue : parsed
}
