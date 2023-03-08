const debugSchema: any = {
  name: "debug",
  fields: [
    { name: "id", type: "int64" },
    { name: "name", type: "string", facet: true },
    { name: "description", type: "string" },
  ],
  default_sorting_field: "name",
};

export default debugSchema;
