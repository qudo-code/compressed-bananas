import {
    PublicKey,
    Connection,
    LAMPORTS_PER_SOL,
    Keypair,
    SystemProgram,
} from "@solana/web3.js";

import {
    createCreateTreeInstruction,
    PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";

import {
    SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    SPL_NOOP_PROGRAM_ID,
    type ValidDepthSizePair,
    getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";

import { sendVersionedTx } from "$lib/util/send-versioned-transaction";

import {
    SECRET_KEYPAIR,
    SECRET_TREE_KEYPAIR,
    SECRET_HELIUS_KEY,
} from "$env/static/private";

const keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(SECRET_KEYPAIR))
);

const merkleTree = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(SECRET_TREE_KEYPAIR))
);

export const GET = async ({ url }) => {
    const connection = new Connection(
        "https://rpc.helius.xyz/?api-key=" + SECRET_HELIUS_KEY
    );

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
        [merkleTree.publicKey.toBuffer()],
        BUBBLEGUM_PROGRAM_ID
    );

    const depthSizePair: ValidDepthSizePair = {
        maxBufferSize: 64,
        maxDepth: 14,
    };

    const space = getConcurrentMerkleTreeAccountSize(
        depthSizePair.maxDepth,
        depthSizePair.maxBufferSize
    );

    const createAccountIx = await SystemProgram.createAccount({
        fromPubkey: keypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(space),
        newAccountPubkey: merkleTree.publicKey,
        programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        space: space,
    });

    const createTreeIx = await createCreateTreeInstruction(
        {
            compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            logWrapper: SPL_NOOP_PROGRAM_ID,
            merkleTree: merkleTree.publicKey,
            payer: keypair.publicKey,
            treeAuthority: treeAuthority,
            treeCreator: keypair.publicKey,
        },
        {
            maxBufferSize: depthSizePair.maxBufferSize,
            maxDepth: depthSizePair.maxDepth,
            public: false,
        }
    );
    const sx = await sendVersionedTx(
        connection,
        [createAccountIx, createTreeIx],
        keypair.publicKey,
        [keypair, merkleTree]
    );

    // eslint-disable-next-line no-console
    console.log(sx);

    return new Response(sx);
};
