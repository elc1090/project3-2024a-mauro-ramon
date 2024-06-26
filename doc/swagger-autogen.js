import dotenv from 'dotenv';
import swaggerAutogen from 'swagger-autogen';

dotenv.config();

const outputFile = './swagger.json';
const index = ['../src/index.js'];

const swaggerOptions = {
    info: {
        title: 'estoque-api',
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    // host: process.env.API_BASE_URL,
    schemes: [
        "https"
    ]
};

swaggerAutogen(outputFile, index, swaggerOptions);