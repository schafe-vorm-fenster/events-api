"use strict";
const eventsSchema = {
    name: "events",
    fields: [
        // content
        { name: "summary.de", type: "string" },
        { name: "summary.en", type: "string" },
        { name: "summary.pl", type: "string" },
        { name: "description.de", type: "string" },
        { name: "description.en", type: "string" },
        { name: "description.pl", type: "string" },
        { name: "link", type: "string" },
        { name: "image", type: "string" },
        { name: "document", type: "string" },
        { name: "categories", type: "string[]", facet: true },
        { name: "classification", type: "string[]", facet: true },
        // date and time
        { name: "start", type: "int64" },
        { name: "end", type: "int64" },
        { name: "allday", type: "bool" },
        { name: "occurrence", type: "string", facet: true },
        // location and geo data
        { name: "location", type: "string" },
        { name: "location.name.de", type: "string" },
        { name: "location.name.en", type: "string" },
        { name: "location.name.pl", type: "string" },
        { name: "location.address", type: "string" },
        { name: "location.geo", type: "geopoint" },
        { name: "scope", type: "string", facet: true },
        { name: "community.id", type: "string", facet: true },
        { name: "community.geo", type: "geopoint" },
        { name: "community.name.de", type: "string" },
        { name: "community.name.en", type: "string" },
        { name: "community.name.pl", type: "string" },
        { name: "municipality.id", type: "string", facet: true },
        { name: "county.id", type: "string", facet: true },
        { name: "state.id", type: "string", facet: true },
        { name: "country.id", type: "string", facet: true },
        // ownership
        { name: "organizer.id", type: "string", facet: true },
        { name: "organizer.name.de", type: "string" },
        { name: "organizer.name.en", type: "string" },
        { name: "organizer.name.pl", type: "string" },
        { name: "calendar.id", type: "string" },
        // document meta data
        { name: "id", type: "int64" },
        { name: "created", type: "int64" },
        { name: "changed", type: "int64" },
        { name: "deleted", type: "int64" },
    ],
    default_sorting_field: "start",
};