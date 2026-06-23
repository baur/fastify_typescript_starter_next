export interface CspConfig {
    directives: {
        defaultSrc: string[]
        scriptSrc: string[]
        styleSrc: string[]
        fontSrc: string[]
        imgSrc: string[]
        connectSrc: string[]
        objectSrc: string[]
        mediaSrc: string[]
        frameSrc: string[]
    }
}

export const cspConfig: CspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'self'"],
    },
}
