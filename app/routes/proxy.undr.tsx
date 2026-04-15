import type { LoaderFunctionArgs } from "react-router";

import { renderAppProxyPage } from "../lib/app-proxy-page.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return renderAppProxyPage(request);
};