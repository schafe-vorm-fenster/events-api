export namespace api {
  export enum events {
    post = "api.events.post",
    community = "api.events.community",
    scope = "api.events.community.scope",
    category = "api.events.community.scope.category",
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
