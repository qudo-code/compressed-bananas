import type { Context } from "$lib/trpc/context";

import { initTRPC } from "@trpc/server";

import { price } from "$lib/trpc/routes/price";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
    price,
});

export type Router = typeof router;
