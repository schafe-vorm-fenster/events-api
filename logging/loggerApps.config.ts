export namespace apiLogger {
  export enum events {
    post = "api.events.post",
    community = "api.events.community",
    scope = "api.events.community.scope",
    category = "api.events.community.scope.category",
    search = "api.events.search",
    delete = "api.events.delete",
    "delete-by-id" = "api.events.delete.by-id",
    "delete-by-date" = "api.events.delete.by-date",
    bulk = "api.events.bulk",
  }
  export enum categories {
    get = "api.categories.get",
  }
  export enum languages {
    get = "api.languages.get",
  }
  export enum schema {
    get = "api.schema.get",
    create = "api.schema.create",
    delete = "api.schema.delete",
  }
}

export namespace clientLogger {
  export enum translation {
    translate = "client.translation.translate",
  }
  export enum classification {
    classify = "client.classification.classify",
    bytag = "client.classification.by-tag",
    bytext = "client.classification.by-text",
  }
  export enum geocode {
    findbyaddress = "client.geocode.find-by-address",
    getcommunity = "client.geocode.get-community",
  }
  export enum googletasks {
    add = "client.googletasks.add-event-to-queue",
  }
  export enum typesense {
    get = "client.typesense.get",
    create = "client.typesense.create",
    delete = "client.typesense.delete",
    search = "client.typesense.search",
  }
}
