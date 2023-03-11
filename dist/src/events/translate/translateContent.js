"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateContent = void 0;
const translateContent = (title, body) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: send title and description to translation api
    // TODO: add/replace translated tags and scopes separately by constants
    return {
        de: {
            title: title,
            body: body,
        },
        en: {
            title: "EN:" + title,
            body: "EN:" + body,
        },
        pl: {
            title: "PL:" + title,
            body: "PL:" + body,
        },
    };
});
exports.translateContent = translateContent;
