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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geoCodeLocation = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_cache_interceptor_1 = require("axios-cache-interceptor");
const checkIfJsonObject_1 = require("../helpers/checkIfJsonObject");
const axios = (0, axios_cache_interceptor_1.setupCache)(axios_1.default);
/**
 * geocode location using the svf geoapi
 * @param location: string
 * @returns GeoLocation
 */
const geoCodeLocation = (location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios
        .get(`${process.env.SVF_GEOAPI_URL}findbyaddress`, {
        params: {
            location: location,
        },
        headers: {
            "Sheep-Token": process.env.SVF_GEOAPI_TOKEN,
            Accept: "application/json",
        },
    })
        .then((response) => {
        (0, checkIfJsonObject_1.checkIfJsonObject)(response.data);
        return response.data;
    })
        .catch((error) => {
        throw error;
    });
});
exports.geoCodeLocation = geoCodeLocation;
