<script lang="ts">
    import { onMount } from "svelte";

    import { trpcWithQuery } from "$lib/trpc/client";

    import { page } from "$app/stores";

    import formatMoney from "$lib/util/format-money";

    const SOL = "So11111111111111111111111111111111111111112";

    const client = trpcWithQuery($page);

    const price = client.price.createQuery(SOL, {
        refetchInterval: 3000,
    });

    import { showModal } from "$lib/state/stores/modals";
</script>

<div class="mx-auto max-w-2xl">
    <h1 class="my-8 text-6xl">SvelteKit Template</h1>

    <h2 class="mt-5 text-3xl">Features</h2>

    <ul class="list-disc">
        <li>tRPC</li>
        <li>TanstackQuery Svelte</li>
        <li>tRpcSvelteQueryAdapter</li>
        <li>Typescript</li>
        <li>Eslint + Prettier</li>
        <li>Tailwind + Daisy</li>
        <li>Custom Modals</li>
    </ul>

    <div class="mt-5 flex justify-center">
        {#if $price.isLoading}
            <p>Loading...</p>
        {:else}
            <h1 class="text-3xl">
                {formatMoney($price.data)}
                <p class="text-xs">SOL/USD</p>
            </h1>
        {/if}
    </div>

    <div class="mt-5 flex justify-center">
        <button
            class="btn"
            on:click={() => showModal("HELP")}>Open Modal</button
        >
    </div>
</div>
