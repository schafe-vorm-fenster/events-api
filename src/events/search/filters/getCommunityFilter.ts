import { isValidGeonameId } from "../../geocode/helpers/isValidGeonameId";

export const getCommunityFilter = (communityId: string): string => {
  if (!communityId || communityId.length === 0)
    throw new Error("communityId is required");
  if (!isValidGeonameId(communityId))
    throw new Error("community id is not valid");
  return `community.id:${communityId}`;
};
