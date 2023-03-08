"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Typesense = require("typesense");
const client = new Typesense.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST || "localhost",
            port: process.env.TYPESENSE_PORT || "8108",
            protocol: process.env.TYPESENSE_PROTOCOL || "http", // For Typesense Cloud use https
        },
    ],
    apiKey: process.env.TYPESENSE_API_KEY || "xyz",
    connectionTimeoutSeconds: process.env.TYPESENSE_CONNECTION_TIMEOUT_SECONDS || 5,
});
exports.default = client;
