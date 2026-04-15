import {
  handleRequest as handleVercelRequest,
  streamTimeout,
} from "@vercel/react-router/entry.server";
import { type AppLoadContext, type EntryContext } from "react-router";
import { addDocumentResponseHeaders } from "./shopify.server";

export { streamTimeout };

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  loadContext?: AppLoadContext
) {
  addDocumentResponseHeaders(request, responseHeaders);

  return handleVercelRequest(
    request,
    responseStatusCode,
    responseHeaders,
    reactRouterContext,
    loadContext
  );
}
