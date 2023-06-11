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

    li {
        margin-left: 1rem;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
</style>

<script type="ts">
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";

    let holders: string[] = [];

    let bananas: string[] = [];

    let mintModal: HTMLDialogElement;

    let state:
        | "resting"
        | "error"
        | "minting"
        | "minted"
        | "verifying"
        | "verified" = "resting";

    const holderCount = tweened(0, { duration: 4000 });

    const wait = (ms: number) =>
        // eslint-disable-next-line promise/avoid-new
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleMint = async () => {
        try {
            state = "minting";

            const { tx, tiplink } = await fetch("/api/mint").then((res) =>
                res.json()
            );

            await wait(8000);

            state = "verifying";

            // TODO: verify logic fr
            // figure outo why nft isn't in tiplink instantly
            // fake waits for now
            // let txResult = [];

            // while (txResult.lenth === 0) {
            //     txResult = await fetch(`/api/verify/${tx}`).then((res) =>
            //         res.json()
            //     );

            //     if (txResult.error) {
            //         throw new Error(txResult.error);
            //     }

            //     await wait(1500);
            // }

            await wait(6000);

            state = "verified";

            await wait(1000);

            window.location.href = tiplink;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);

            state = "error";
        }
    };

    const getHolders = async () => {
        try {
            holders = await fetch("/api/get-holders").then((res) => res.json());

            holderCount.set(holders?.length || 0);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };

    $: if (Number($holderCount.toFixed()) >= 1) {
        bananas.push("🍌");

        bananas = bananas;
    }

    $: showVerifyState = state === "verifying" || state === "verified";
    $: showMintingState = state === "minting" || state === "minted";

    onMount(async () => {
        try {
            await getHolders();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);

            getHolders;
        }
    });
</script>

<div
    class="wrapper flex min-h-screen w-screen items-center justify-center overflow-hidden p-3 py-20"
>
    <div class="items-cente flex max-w-4xl flex-col text-black">
        <h1 class="border-black font-bold text-white shadow-xl md:text-8xl">
            cbananas.com
        </h1>

        <div class="mb-5 rounded-xl bg-white bg-opacity-90 p-5">
            <div class="flex justify-between">
                <div>
                    <h1 class="text-4xl font-bold">🍌 Compressed Bananas 🍌</h1>
                    <h3 class="text-xl font-bold opacity-70">
                        Mint. More. Bananas.
                    </h3>
                </div>
            </div>

            <div class="my-5 rounded bg-blue-200 p-2 text-black shadow-lg">
                <h3 class="text-xl font-bold">
                    <span class="text-3xl"> 🍬 </span> No wallet required to mint!
                </h3>
                <p class="opacity-70">
                    Click the button below to celebrate NYC Hacker House and
                    mint a free compressed NFT to a TipLink for you to claim
                    with whatever wallet you want.
                </p>
            </div>

            <div class="my-10 grid grid-cols-1 items-start md:grid-cols-2">
                <div class="my-5">
                    <img
                        src="/graph.png"
                        class="mx-auto my-3"
                        alt=""
                    />
                </div>
                <div>
                    <h3 class="text-4xl font-bold">How it Works</h3>
                    <ol>
                        <li>🍌 Click mint button to kick things off.</li>
                        <li>
                            🍌 A <a
                                class="link"
                                href="https://tiplink.io"
                                target="blank">TipLink</a
                            > wallet will be gennertated.
                        </li>
                        <li>
                            🍌 A <a
                                class="link"
                                href="https://docs.metaplex.com/programs/compression/"
                                target="blank">cNFT</a
                            > of a banana at NY Hacker House will be minted to the
                            TipLink wallet.
                        </li>
                        <li>
                            🍌 User will be presented with their prize where
                            they can claim via Gmail or browser wallet.
                        </li>
                    </ol>

                    {#if state === "resting"}
                        <button
                            on:click={handleMint}
                            class="btn-xl btn-primar btn w-full border-0 bg-green-500 hover:bg-green-100"
                        >
                            <span class="text-xl text-white hover:text-black"
                                >Mint</span
                            >
                        </button>
                    {/if}
                </div>
            </div>
            {#if showVerifyState || showMintingState}
                <div class="my-3">
                    <button
                        class:btn-outline={state === "minting"}
                        class:loading={state === "minting"}
                        class:btn-success={state === "minted" ||
                            showVerifyState}
                        class="loading btn pointer-events-none mt-4 text-black"
                    >
                        <span
                            class="text-xl"
                            class:text-white={state === "minted" ||
                                showVerifyState}
                        >
                            {#if state === "minted" || showVerifyState}✅{/if}

                            MINTING CNFT & GENERATING WALLET
                        </span>
                    </button>
                </div>

                {#if showVerifyState}
                    <div class="my-3">
                        <button
                            class:btn-outline={state === "verifying"}
                            class:loading={state === "verifying"}
                            class:btn-success={state === "verified"}
                            class="loading btn pointer-events-none mt-4 text-black"
                        >
                            <span
                                class="text-xl"
                                class:text-white={state === "verified"}
                            >
                                {#if state === "verified"}✅{/if}

                                Verifying Mint
                            </span>
                        </button>
                    </div>
                {/if}

                {#if state === "verified"}
                    <div>
                        <button
                            class="btn-outline loading btn pointer-events-none mt-4 text-black"
                        >
                            <span class="text-xl"> Loading TipLink... </span>
                        </button>
                    </div>
                {/if}
            {/if}

            {#if state === "error"}
                <div class="alert alert-warning flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        /></svg
                    >
                    <span>Failed to mint for some reason. Try again?</span>
                    <button
                        class="btn-outline btn border-black text-black"
                        on:click={() => (state = "resting")}>Okay</button
                    >
                </div>
            {/if}

            <div class="flex flex-wrap">
                {#each bananas as _}
                    <span class="text-2xl">🍌</span>
                {/each}

                <p class="ml-2 text-xl font-bold">
                    {$holderCount.toFixed()} Holders
                </p>
            </div>
        </div>
    </div>
</div>
