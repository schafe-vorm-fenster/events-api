export namespace api {
  export enum events {
    post = "api.events.post",
    community = "api.events.community",
    scope = "api.events.community.scope",
    category = "api.events.community.scope.category",
    search = "api.events.search",
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

export namespace client {
  export enum translation {
    translate = "client.translation.translate",
  }
  export enum classification {
    classify = "client.classification.classify",
    bytag = "client.classification.bytag",
    bytext = "client.classification.bytext",
  }
  export enum geocode {
    findbyaddress = "client.geocode.findbyaddress",
  }
}
