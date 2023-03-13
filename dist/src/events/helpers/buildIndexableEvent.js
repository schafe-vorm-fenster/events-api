"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIndexableEvent = void 0;
const buildIndexableEvent = (rawEvent, uuid, geolocation, metadata, scope, classification, translatedContent) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
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
        occurrence: "",
        "location.raw": rawEvent.location || "",
        "location.name": geolocation.localName || geolocation.name || rawEvent.location || "",
        "location.address": geolocation.address || rawEvent.location || "",
        "location.geopoint": [
            ((_g = geolocation.geo) === null || _g === void 0 ? void 0 : _g.point.lat) || 0,
            ((_h = geolocation.geo) === null || _h === void 0 ? void 0 : _h.point.lng) || 0,
        ],
        scope: scope,
        "community.id": "geoname." + ((_k = (_j = geolocation.hierarchy) === null || _j === void 0 ? void 0 : _j.community) === null || _k === void 0 ? void 0 : _k.geonameId) || "",
        "community.geopoint": [0, 0],
        "community.name": ((_m = (_l = geolocation.hierarchy) === null || _l === void 0 ? void 0 : _l.community) === null || _m === void 0 ? void 0 : _m.name) || "",
        "municipality.id": "geoname." + ((_p = (_o = geolocation.hierarchy) === null || _o === void 0 ? void 0 : _o.municipality) === null || _p === void 0 ? void 0 : _p.geonameId),
        "municipality.name": ((_r = (_q = geolocation.hierarchy) === null || _q === void 0 ? void 0 : _q.municipality) === null || _r === void 0 ? void 0 : _r.name) || "",
        "county.id": "geoname." + ((_t = (_s = geolocation.hierarchy) === null || _s === void 0 ? void 0 : _s.county) === null || _t === void 0 ? void 0 : _t.geonameId) || "",
        "county.name": ((_v = (_u = geolocation.hierarchy) === null || _u === void 0 ? void 0 : _u.county) === null || _v === void 0 ? void 0 : _v.name) || "",
        "state.id": "geoname." + ((_x = (_w = geolocation.hierarchy) === null || _w === void 0 ? void 0 : _w.state) === null || _x === void 0 ? void 0 : _x.geonameId) || "",
        "state.name": ((_z = (_y = geolocation.hierarchy) === null || _y === void 0 ? void 0 : _y.state) === null || _z === void 0 ? void 0 : _z.name) || "",
        "country.id": "geoname." + ((_1 = (_0 = geolocation.hierarchy) === null || _0 === void 0 ? void 0 : _0.country) === null || _1 === void 0 ? void 0 : _1.geonameId) || "",
        "country.name": ((_3 = (_2 = geolocation.hierarchy) === null || _2 === void 0 ? void 0 : _2.country) === null || _3 === void 0 ? void 0 : _3.name) || "",
        "organizer.id": ((_4 = rawEvent.organizer) === null || _4 === void 0 ? void 0 : _4.id) || ((_5 = rawEvent.organizer) === null || _5 === void 0 ? void 0 : _5.email) || "",
        "organizer.name": ((_6 = rawEvent.organizer) === null || _6 === void 0 ? void 0 : _6.displayName) || "",
        "calendar.id": ((_7 = rawEvent.organizer) === null || _7 === void 0 ? void 0 : _7.id) || ((_8 = rawEvent.organizer) === null || _8 === void 0 ? void 0 : _8.email) || "",
        "calendar.name": ((_9 = rawEvent.organizer) === null || _9 === void 0 ? void 0 : _9.displayName) || "",
        created: 0,
        changed: 0,
        deleted: 0,
    };
    return indexableEvent;
};
exports.buildIndexableEvent = buildIndexableEvent;
