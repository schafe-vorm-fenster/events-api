const eventsSchema: any = {
  name: "events",
  fields: [
    // content
    { name: "summary.de", type: "string" },
    { name: "summary.en", type: "string" },
    { name: "summary.pl", type: "string" },
    { name: "description.de", type: "string" },
    { name: "description.en", type: "string" },
    { name: "description.pl", type: "string" },
    { name: "link", type: "string" }, // detail link
    { name: "image", type: "string" }, // image link
    { name: "image.exists", type: "bool", facet: true },
    { name: "document", type: "string" }, // pdf link
    { name: "document.exists", type: "bool", facet: true },
    { name: "categories", type: "string[]", facet: true }, // svf categories
    { name: "classification.l1", type: "string[]", facet: true }, // googles classification
    { name: "classification.l2", type: "string[]", facet: true }, // googles classification
    { name: "classification.l3", type: "string[]", facet: true }, // googles classification

    // date and time
    { name: "start", type: "int64" },
    { name: "end", type: "int64" },
    { name: "allday", type: "bool", facet: true },
    { name: "occurrence", type: "string", facet: true }, // once, recurring, series, openinghours
    { name: "series.id", type: "string", facet: true },

    // location and geo data
    { name: "location.raw", type: "string" },
    { name: "location.name", type: "string", facet: true },
    { name: "location.localname", type: "string" },
    { name: "location.address", type: "string" },
    { name: "location.geopoint", type: "geopoint" },
    { name: "scope", type: "string", facet: true },
    { name: "community.id", type: "string", facet: true },
    { name: "community.geopoint", type: "geopoint" },
    { name: "community.name", type: "string" },
    { name: "municipality.id", type: "string", facet: true },
    { name: "municipality.name", type: "string" },
    { name: "county.id", type: "string", facet: true },
    { name: "county.name", type: "string" },
    { name: "state.id", type: "string", facet: true },
    { name: "state.name", type: "string" },
    { name: "country.id", type: "string", facet: true },
    { name: "country.name", type: "string" },

    // ownership
    { name: "organizer.id", type: "string", facet: true },
    { name: "organizer.name", type: "string" },
    { name: "calendar.id", type: "string", facet: true },
    { name: "calendar.name", type: "string" },

    // document meta data
    { name: "created", type: "int64" },
    { name: "changed", type: "int64" },
    { name: "deleted", type: "int64" },
  ],
  default_sorting_field: "start",
};

export default eventsSchema;
