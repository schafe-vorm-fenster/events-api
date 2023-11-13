import { getGeoLocation } from "../../geocode/getGeoLocation";
import { GeoLocation } from "../../geocode/types/GeoLocation";
import { CommunityCenterQuery } from "../searchEvents";

export const getCommunityCenter = async (
  geonameId: number
): Promise<CommunityCenterQuery> => {
  const communityObject: GeoLocation = (await getGeoLocation(
    geonameId
  )) as GeoLocation;

  const geopoint: [number, number] = [
    communityObject.geo?.point.lat as number,
    communityObject.geo?.point.lng as number,
  ];
  const communityId: string = ("geoname." +
    communityObject.geonamesId?.toString()) as string;
  const municipalityId: string =
    "geoname." + communityObject.hierarchy?.municipality?.geonameId;
  const countyId: string =
    "geoname." + communityObject.hierarchy?.county?.geonameId;
  const stateId: string =
    "geoname." + communityObject.hierarchy?.state?.geonameId;
  const countryId: string =
    "geoname." + communityObject.hierarchy?.country?.geonameId;

  return {
    geopoint,
    communityId,
    municipalityId,
    countyId,
    stateId,
    countryId,
  };
};
