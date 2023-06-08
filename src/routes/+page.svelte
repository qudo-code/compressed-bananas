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

<div
    class="wrapper flex h-screen w-screen items-center justify-center overflow-hidden"
>
    <div>
        <h1>Compressed Bananas</h1>
        <p>
            Scan the Solana Pay code below with your wallat to get a Compressed
            Banana.
        </p>
        <img
            class="max-w-10 w-full"
            src="/qrcode.png"
            alt=""
        />
    </div>
</div>
