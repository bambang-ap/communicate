import { GetServerSidePropsContext } from "next";

export function getBaseUrl(req: GetServerSidePropsContext['req']) {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.host}`;

	return baseUrl;
}
