const z = require('zod');

const dbSchema = z.object({
    id: z.number(),
    name: z.string(),
    ki: z.string(),  // Cambiado a string
    maxKi: z.string(), // Cambiado a string
    race: z.string(),
    gender: z.string(),
    description: z.string(),
    image: z.string().url(),
    affiliation: z.string(),
    deletedAt: z.nullable(z.boolean()),
    originPlanet: z.object({
        id: z.number(),
        name: z.string(),
        isDestroyed: z.boolean(),
        description: z.string(),
        image: z.string().url(),
        deletedAt: z.nullable(z.boolean())
    }),
    transformations: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            image: z.string().url(),
            ki: z.string(), // Cambiado a string
            deletedAt: z.nullable(z.boolean())
        })
    )
});

function validateDB(input) {
    return dbSchema.safeParse(input);
}

module.exports = {
    validateDB
};
