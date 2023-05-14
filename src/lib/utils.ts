import { type Config, adjectives, colors, animals, uniqueNamesGenerator } from "unique-names-generator"

export function generateRandomUsername(): string {
    const config: Config = {
        dictionaries: [adjectives, colors, animals],
        separator: "-"
    }

    return uniqueNamesGenerator(config)
}