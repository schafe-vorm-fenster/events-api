"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Typesense = require("typesense");
const client = new Typesense.Client({
    nodes: [
        {
            host: "localhost",
            port: "8108",
            protocol: "http", // For Typesense Cloud use https
        },
    ],
    apiKey: "xyz",
    connectionTimeoutSeconds: 5,
});
exports.default = client;
