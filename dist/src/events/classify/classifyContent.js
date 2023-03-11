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
exports.classifyContent = void 0;
const classifyContent = (tags, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    let mappedCategories = [];
    // map given tags to RuralEventCategoryId[]
    // TODO: maybe do everything here by the new classification api
    if (tags && tags.length > 0) {
        // TODO: map
        mappedCategories.push("culture-tourism"); // TODO: replace dummy
    }
    // if mapping was unsuccessful, than classify by given title and body with Google Natural Language API
    // TODO: maybe do everythoing here by the new classification api
    if (mappedCategories.length === 0) {
        mappedCategories.push("education-health"); // TODO: replace dummy
    }
    return {
        categories: mappedCategories,
        "classification.l1": ["/Travel"],
        "classification.l2": ["/Travel/Tourist Destinations"],
        "classification.l3": [],
    };
});
exports.classifyContent = classifyContent;
