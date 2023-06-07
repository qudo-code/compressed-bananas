<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 4rem;
    }
</style>

<script lang="ts">
    import "../app.postcss";

    import type { LayoutData } from "./$types";

    import { QueryClientProvider } from "@tanstack/svelte-query";

    import Modals from "$lib/components/modals.svelte";

    export let data: LayoutData;
</script>

<Modals />

<QueryClientProvider client={data.queryClient}>
    <main class="grid min-h-screen">
        <div class="relative mx-auto w-full">
            <slot />
        </div>
    </main>
</QueryClientProvider>
