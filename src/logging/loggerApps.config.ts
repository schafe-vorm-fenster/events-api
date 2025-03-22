export enum ApiEvents {
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

export enum ApiUpdate {
  calendar = "api.update.calendar",
  all = "api.update.calendars.all",
}

export enum ApiCategories {
  get = "api.categories.get",
}

export enum ApiLanguages {
  get = "api.languages.get",
}

export enum ApiSchema {
  get = "api.schema.get",
  create = "api.schema.create",
  delete = "api.schema.delete",
}
export enum ClientTranslation {
  config = "client.translation.config",
  translate = "client.translation.translate",
}

export enum ClientClassification {
  config = "client.classification.config",
  classify = "client.classification.classify",
  bytag = "client.classification.by-tag",
  bytext = "client.classification.by-text",
}

export enum ClientCalendar {
  config = "client.calendar.config",
  calendars = "client.calendar.calendars",
  events = "client.calendar.events",
}

export enum ClientGeo {
  config = "client.geo.config",
  findbyaddress = "client.geocode.find-by-address",
  getcommunity = "client.geocode.get-community",
}

export enum ClientGoogleTasks {
  config = "client.googletasks.config",
  "add-event" = "client.googletasks.add-event-to-queue",
  "add-calendar" = "client.googletasks.add-calendar-to-queue",
}

export enum ClientTypesense {
  config = "client.typesense.config",
  get = "client.typesense.get",
  create = "client.typesense.create",
  delete = "client.typesense.delete",
  search = "client.typesense.search",
}
