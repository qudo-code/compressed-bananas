import { json } from "@sveltejs/kit";

import { SECRET_HELIUS_KEY } from "$env/static/private";

export const GET = async ({ request }) => {
    try {
        let page = 1;
        let hasMoreResults = true;

        const uniqueOwners = new Set();

        while (hasMoreResults) {
            const response = await fetch(
                "https://rpc.helius.xyz/?api-key=" + SECRET_HELIUS_KEY,
                {
                    body: JSON.stringify({
                        id: "my-id",
                        jsonrpc: "2.0",
                        method: "getAssetsByGroup",
                        params: {
                            groupKey: "collection",
                            groupValue:
                                "Co1sfWfgK6PEMURzgQFK19hX5gnnEdq7DED6bj1QdUoV",
                            limit: 1000,
                            page,
                        },
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }
            );

            const { result } = await response.json();

            // Add each owner to the Set, automatically discarding duplicates
            result?.items?.forEach((item) =>
                uniqueOwners.add(item?.ownership?.owner)
            );

            if (result.items.length < 1000) {
                hasMoreResults = false;
            } else {
                page++;
            }
        }

        return json(Array.from(uniqueOwners));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);

        return json({});
    }
};
