import {
    createCreateTreeInstruction,
    PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
    createMintToCollectionV1Instruction,
    TokenProgramVersion,
} from "@metaplex-foundation/mpl-bubblegum";
import { sendVersionedTx } from "$lib/util/send-versioned-transaction";
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    VersionedMessage,
} from "@solana/web3.js";
import {
    SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    SPL_NOOP_PROGRAM_ID,
    ValidDepthSizePair,
    getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { SECRET_KEYPAIR, SECRET_TREE_KEYPAIR } from "$env/static/private";
import { json, redirect } from "@sveltejs/kit";

import { TipLink } from "@tiplink/api";

export const GET = async ({ request }) => {
    try {
        const connection = new Connection(
            "https://api.mainnet-beta.solana.com"
        );
        const tiplink = await TipLink.create();

        const keypair = Keypair.fromSecretKey(
            new Uint8Array(JSON.parse(SECRET_KEYPAIR))
        );

        const merkleTree = Keypair.fromSecretKey(
            new Uint8Array(JSON.parse(SECRET_TREE_KEYPAIR))
        );

        const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
            [merkleTree.publicKey.toBuffer()],
            BUBBLEGUM_PROGRAM_ID
        );

        const collectionMint = new PublicKey(
            "Co1sfWfgK6PEMURzgQFK19hX5gnnEdq7DED6bj1QdUoV"
        );

        const [collectionMetadataAccount, _b1] =
            PublicKey.findProgramAddressSync(
                [
                    Buffer.from("metadata", "utf8"),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    collectionMint.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID
            );
        const [collectionEditionAccount, _b2] =
            PublicKey.findProgramAddressSync(
                [
                    Buffer.from("metadata", "utf8"),
                    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                    collectionMint.toBuffer(),
                    Buffer.from("edition", "utf8"),
                ],
                TOKEN_METADATA_PROGRAM_ID
            );
        const [bgumSigner, __] = PublicKey.findProgramAddressSync(
            [Buffer.from("collection_cpi", "utf8")],
            BUBBLEGUM_PROGRAM_ID
        );
        const ix = await createMintToCollectionV1Instruction(
            {
                bubblegumSigner: bgumSigner,
                collectionAuthority: keypair.publicKey,
                collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
                collectionMetadata: collectionMetadataAccount,
                collectionMint: collectionMint,
                compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
                editionAccount: collectionEditionAccount,
                leafDelegate: keypair.publicKey,
                leafOwner: tiplink.keypair.publicKey,
                logWrapper: SPL_NOOP_PROGRAM_ID,
                merkleTree: merkleTree.publicKey,
                payer: keypair.publicKey,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                treeAuthority: treeAuthority,
                treeDelegate: keypair.publicKey,
            },
            {
                metadataArgs: {
                    collection: { key: collectionMint, verified: false },
                    creators: [],
                    editionNonce: null,
                    isMutable: true,
                    name: "Compressed Banana",
                    primarySaleHappened: true,
                    sellerFeeBasisPoints: 0,
                    symbol: "cQUDO",
                    tokenProgramVersion: TokenProgramVersion.Original,
                    tokenStandard: null,
                    uri: "https://shdw-drive.genesysgo.net/7LsXy7eqD3RGuKXxmwE245akJeZURRSgN8vAuYWdS5JF/nft-metadata.json",
                    uses: null,
                },
            }
        );

        const transaction = new Transaction();

        transaction.add(ix);

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash("finalized")
        ).blockhash;

        transaction.feePayer = keypair.publicKey;

        const tx = await sendVersionedTx(connection, [ix], keypair.publicKey, [
            keypair,
        ]);

        const message = "Mint a Compressed Banana by @_qudo!";

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        await wait(5000);

        return new Response("Redirect", {
            headers: { Location: tiplink.url },
            status: 303,
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);

        return new Response("Redirect", {
            headers: { Location: "/" },
            status: 303,
        });
    }
};
