<style>
    .wrapper {
        background-image: url(/bananas.jpeg);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    img {
        width: 100%;
        max-width: 300px;
    }
</style>

<script type="ts">
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";

    let holders: string[] = [];
    let isLoading = false;

    const holderCount = tweened(0, { duration: 2000 });

    let something = 0;

    const getHolders = async () => {
        try {
            holders = await fetch("/api/get-holders").then((res) => res.json());

            holderCount.set(holders?.length || 0);
        } catch (error) {
            console.log(error);
        }
    };

    onMount(async () => {
        try {
            await getHolders();
        } catch (error) {
            console.log(error);

            getHolders;
        }
    });
</script>

<div
    class="wrapper flex min-h-screen w-screen items-center justify-center overflow-hidden p-3 py-20"
>
    <div class="flex max-w-3xl flex-col items-center">
        <div class="glass mb-5 rounded-xl p-5">
            <h1 class="text-3xl font-bold">🍌 Compressed Bananas 🍌</h1>
            <p class="text-xl font-bold">
                {$holderCount
                    ? `Unique Holders: ${$holderCount.toFixed()} `
                    : "Getting holder count..."}
            </p>
            <div class="my-5 rounded bg-blue-200 p-2 text-black shadow-lg">
                <h3 class="text-xl font-bold">
                    <span class="text-xl"> 🍬 </span> No wallet required to mint!
                </h3>
                <p class="opacity-70">
                    Click the button below to celebrate NYC Hacker House and
                    mint a free compressed NFT to a TipLink for you to claim
                    with whatever wallet you want.
                </p>
            </div>

            <div class="my-5 rounded bg-orange-200 p-2 text-black shadow-lg">
                <strong class="text-lg">👀 Note</strong>
                <p class="opacity-70">
                    Freshly minted compressed NFTs have some unique
                    characteristics and might take 10ish seconds to show up on
                    the TipLink. If it doesn't show up right away to claim,
                    refresh until ready. 🤝
                </p>
            </div>

            <h2 class="my-2 mt-4 text-xl font-bold">
                🎁 Example TipLink Claim (Once Processed)
            </h2>
            <img
                class="mx-auto w-full rounded-xl"
                src="/example.png"
                alt=""
            />
        </div>
        <a
            href="/api/mint"
            on:click={() => (isLoading = true)}
            class="btn-xl btn-primary btn w-full border-0 bg-green-500 hover:bg-white hover:text-black"
            class:loading={isLoading}
        >
            <h2 class="text-xl">Mint Compressed Banana</h2>
        </a>

        {#if holders?.length}
            <h1 class="mt-4 w-full text-left text-4xl font-bold">Holders</h1>
            {#each holders as holder}
                <div class="glass my-1 w-full rounded p-4 shadow">
                    <p>{holder}</p>
                </div>
            {/each}
        {/if}
    </div>
</div>
