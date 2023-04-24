/**
 * Type to structure typical metadata. Text as description and optional data.
 */
interface TextWithData {
  description: string;
  url?: string;
  tags?: string[];
  scopes?: string[];
  image?: string;
  document?: string;
}

export { TextWithData };
