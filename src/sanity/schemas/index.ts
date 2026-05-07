import type { SchemaTypeDefinition } from "sanity";
import { blogPost } from "./blogPost";
import { page } from "./page";
import { regionGuide } from "./regionGuide";

export const schemaTypes: SchemaTypeDefinition[] = [blogPost, page, regionGuide];
