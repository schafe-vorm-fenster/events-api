"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugSchema = {
    name: "debug",
    fields: [
        { name: "id", type: "int64" },
        { name: "name", type: "string", facet: true },
        { name: "description", type: "string" },
    ],
    default_sorting_field: "name",
};
exports.default = debugSchema;
