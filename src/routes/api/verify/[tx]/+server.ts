import { SECRET_HELIUS_KEY } from "$env/static/private";

import { json, redirect } from "@sveltejs/kit";

export const GET = async ({ request, params }) => {
    const tx = request.params;

    try {
        const response = await fetch(
            `https://api.helius.xyz/v0/transactions?api-key=${SECRET_HELIUS_KEY}`,
            {
                body: JSON.stringify({
                    transactions: [params?.tx],
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            }
        ).then((res) => res.json());

        return new Response(JSON.stringify(response));
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);

        return new Response("Redirect", {
            headers: { Location: "/" },
            status: 303,
        });
    }
};
