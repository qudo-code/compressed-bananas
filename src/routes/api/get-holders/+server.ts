import { json } from "@sveltejs/kit";

export const GET = async ({ request }) => {
    try {
        let page = 1;
        let hasMoreResults = true;

        const uniqueOwners = new Set();

        while (hasMoreResults) {
            const response = await fetch(
                "https://rpc.helius.xyz/?api-key=86425814-70c5-46d2-a033-c675dd0659de",
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

        // Convert Set to Array for stringification
        const uniqueOwnersArray = Array.from(uniqueOwners);

        // const root = {
        //     count: uniqueOwners.size,
        //     owners: uniqueOwnersArray,
        // };

        // const jsonResult = JSON.stringify(root, null, 2);

        // console.log({ jsonResult });

        return json(uniqueOwnersArray);
    } catch (error) {
        console.log(error);

        return json({});
    }
};
