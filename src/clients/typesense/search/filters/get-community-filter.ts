import {
  GeonameId,
  GeonameIdSchema,
} from "../../../../events/types/geonames.types";

export const getCommunityFilter = (communityId: GeonameId): string => {
  GeonameIdSchema.parse(communityId);
  return `community.id:${communityId}`;
};
