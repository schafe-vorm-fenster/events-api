"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svfLocales = void 0;
const languages = require("@cospired/i18n-iso-languages");
exports.svfLocales = [
    {
        locale: "de",
        localizations: [
            {
                locale: "de",
                name: languages.getName("de", "de"),
            },
            {
                locale: "en",
                name: languages.getName("de", "en"),
            },
            {
                locale: "pl",
                name: languages.getName("de", "pl"),
            },
        ],
    },
    {
        locale: "en",
        localizations: [
            {
                locale: "de",
                name: languages.getName("en", "de"),
            },
            {
                locale: "en",
                name: languages.getName("en", "en"),
            },
            {
                locale: "pl",
                name: languages.getName("en", "pl"),
            },
        ],
    },
    {
        locale: "pl",
        localizations: [
            {
                locale: "de",
                name: languages.getName("pl", "de"),
            },
            {
                locale: "en",
                name: languages.getName("pl", "en"),
            },
            {
                locale: "pl",
                name: languages.getName("pl", "pl"),
            },
        ],
    },
];
