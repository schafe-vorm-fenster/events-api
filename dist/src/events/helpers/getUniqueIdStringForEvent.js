"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueIdStringForEvent = void 0;
/**
 * get unique id string for event
 * @param event
 * @returns string
 */
const getUniqueIdStringForEvent = (event) => {
    var _a, _b, _c, _d;
    const eventId = event.id || event.etag || null;
    const calendarId = ((_a = event.organizer) === null || _a === void 0 ? void 0 : _a.id) ||
        ((_b = event.organizer) === null || _b === void 0 ? void 0 : _b.email) ||
        ((_c = event.creator) === null || _c === void 0 ? void 0 : _c.id) ||
        ((_d = event.creator) === null || _d === void 0 ? void 0 : _d.email) ||
        event.iCalUID ||
        null;
    if (!calendarId && !eventId)
        throw new Error("could not generate a uuid for this event");
    return (calendarId + eventId);
};
exports.getUniqueIdStringForEvent = getUniqueIdStringForEvent;
