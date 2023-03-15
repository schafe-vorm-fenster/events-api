"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIndexableEvent = void 0;
const buildIndexableEvent = (rawEvent, uuid, geolocation, metadata, scope, classification, translatedContent) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    const indexableEvent = {
        id: uuid,
        "summary.de": ((_a = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.de) === null || _a === void 0 ? void 0 : _a.title) || "",
        "summary.en": ((_b = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.en) === null || _b === void 0 ? void 0 : _b.title) || "",
        "summary.pl": ((_c = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.pl) === null || _c === void 0 ? void 0 : _c.title) || "",
        "description.de": ((_d = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.de) === null || _d === void 0 ? void 0 : _d.body) || "",
        "description.en": ((_e = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.en) === null || _e === void 0 ? void 0 : _e.body) || "",
        "description.pl": ((_f = translatedContent === null || translatedContent === void 0 ? void 0 : translatedContent.pl) === null || _f === void 0 ? void 0 : _f.body) || "",
        link: (metadata === null || metadata === void 0 ? void 0 : metadata.url) || "",
        image: (metadata === null || metadata === void 0 ? void 0 : metadata.image) || "",
        document: "",
        categories: (classification === null || classification === void 0 ? void 0 : classification.categories) || [],
        "classification.l1": (classification === null || classification === void 0 ? void 0 : classification["classification.l1"]) || [],
        "classification.l2": (classification === null || classification === void 0 ? void 0 : classification["classification.l2"]) || [],
        "classification.l3": (classification === null || classification === void 0 ? void 0 : classification["classification.l3"]) || [],
        start: 0,
        end: 0,
        allday: false,
        occurrence: (rawEvent === null || rawEvent === void 0 ? void 0 : rawEvent.recurrence) &&
            ((_g = rawEvent === null || rawEvent === void 0 ? void 0 : rawEvent.recurrence) === null || _g === void 0 ? void 0 : _g.length) > 0 &&
            rawEvent.recurringEventId
            ? "recurring"
            : "",
        "location.raw": rawEvent.location || "",
        "location.name": geolocation.localName || geolocation.name || rawEvent.location || "",
        "location.address": geolocation.address || rawEvent.location || "",
        "location.geopoint": [
            ((_h = geolocation.geo) === null || _h === void 0 ? void 0 : _h.point.lat) || 0,
            ((_j = geolocation.geo) === null || _j === void 0 ? void 0 : _j.point.lng) || 0,
        ],
        scope: scope,
        "community.id": "geoname." + ((_l = (_k = geolocation.hierarchy) === null || _k === void 0 ? void 0 : _k.community) === null || _l === void 0 ? void 0 : _l.geonameId) || "",
        "community.geopoint": [
            ((_m = geolocation.geo) === null || _m === void 0 ? void 0 : _m.point.lat) || 0,
            ((_o = geolocation.geo) === null || _o === void 0 ? void 0 : _o.point.lng) || 0,
        ],
        "community.name": ((_q = (_p = geolocation.hierarchy) === null || _p === void 0 ? void 0 : _p.community) === null || _q === void 0 ? void 0 : _q.name) || "",
        "municipality.id": "geoname." + ((_s = (_r = geolocation.hierarchy) === null || _r === void 0 ? void 0 : _r.municipality) === null || _s === void 0 ? void 0 : _s.geonameId),
        "municipality.name": ((_u = (_t = geolocation.hierarchy) === null || _t === void 0 ? void 0 : _t.municipality) === null || _u === void 0 ? void 0 : _u.name) || "",
        "county.id": "geoname." + ((_w = (_v = geolocation.hierarchy) === null || _v === void 0 ? void 0 : _v.county) === null || _w === void 0 ? void 0 : _w.geonameId) || "",
        "county.name": ((_y = (_x = geolocation.hierarchy) === null || _x === void 0 ? void 0 : _x.county) === null || _y === void 0 ? void 0 : _y.name) || "",
        "state.id": "geoname." + ((_0 = (_z = geolocation.hierarchy) === null || _z === void 0 ? void 0 : _z.state) === null || _0 === void 0 ? void 0 : _0.geonameId) || "",
        "state.name": ((_2 = (_1 = geolocation.hierarchy) === null || _1 === void 0 ? void 0 : _1.state) === null || _2 === void 0 ? void 0 : _2.name) || "",
        "country.id": "geoname." + ((_4 = (_3 = geolocation.hierarchy) === null || _3 === void 0 ? void 0 : _3.country) === null || _4 === void 0 ? void 0 : _4.geonameId) || "",
        "country.name": ((_6 = (_5 = geolocation.hierarchy) === null || _5 === void 0 ? void 0 : _5.country) === null || _6 === void 0 ? void 0 : _6.name) || "",
        "organizer.id": ((_7 = rawEvent.organizer) === null || _7 === void 0 ? void 0 : _7.id) || ((_8 = rawEvent.organizer) === null || _8 === void 0 ? void 0 : _8.email) || "",
        "organizer.name": ((_9 = rawEvent.organizer) === null || _9 === void 0 ? void 0 : _9.displayName) || "",
        "calendar.id": ((_10 = rawEvent.creator) === null || _10 === void 0 ? void 0 : _10.id) || ((_11 = rawEvent.creator) === null || _11 === void 0 ? void 0 : _11.email) || "",
        "calendar.name": ((_12 = rawEvent.creator) === null || _12 === void 0 ? void 0 : _12.displayName) || "",
        created: 0,
        changed: 0,
        deleted: 0, // TODO interprete date to timestamp
    };
    return indexableEvent;
};
exports.buildIndexableEvent = buildIndexableEvent;
