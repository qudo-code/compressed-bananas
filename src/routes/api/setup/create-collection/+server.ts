import {
    createCreateMetadataAccountV3Instruction,
    createCreateMasterEditionV3Instruction,
    createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
    TOKEN_PROGRAM_ID,
    createAccount,
    createMint,
    mintTo,
} from "@solana/spl-token";
import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import {
    SECRET_COLLECTION_KEYPAIR,
    SECRET_KEYPAIR,
    SECRET_RPC,
} from "$env/static/private";

export const GET = async ({ url }) => {
    const connection = new Connection(SECRET_RPC);

    const cmintKey = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(SECRET_COLLECTION_KEYPAIR))
    );

    const payer = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(SECRET_KEYPAIR))
    );

    // eslint-disable-next-line no-console
    console.log("1");

    // The collection account (swap with your own)
    const collectionMint = new PublicKey(
        "Co1sfWfgK6PEMURzgQFK19hX5gnnEdq7DED6bj1QdUoV"
    );

    // The collection token account (swap with your own)
    const collectionTokenAccount = new PublicKey(
        "7wX25Y1zWjJPbz9havqqUMDifzNNQ8pa5eZsQNXaHxbp"
    );

    // eslint-disable-next-line no-console
    console.log("2");

    await mintTo(
        connection,
        payer,
        collectionMint,
        collectionTokenAccount,
        payer,
        1,
        [],
        { commitment: "finalized" }
    );

    // eslint-disable-next-line no-console
    console.log("3");

    const [collectionMetadataAccount, _b] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf8"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            collectionMint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    const collectionMeatadataIX = createCreateMetadataAccountV3Instruction(
        {
            metadata: collectionMetadataAccount,
            mint: collectionMint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                collectionDetails: null,
                data: {
                    collection: null,
                    creators: null,
                    name: "Compressed Bananas",
                    sellerFeeBasisPoints: 0,
                    symbol: "cQUDO",
                    uri: "https://shdw-drive.genesysgo.net/7LsXy7eqD3RGuKXxmwE245akJeZURRSgN8vAuYWdS5JF/collection-metadata.json",
                    uses: null,
                },
                isMutable: true,
            },
        },
        TOKEN_METADATA_PROGRAM_ID
    );

    const [collectionMasterEditionAccount, _b2] =
        PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata", "utf8"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                collectionMint.toBuffer(),
                Buffer.from("edition", "utf8"),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

    const collectionMasterEditionIX = createCreateMasterEditionV3Instruction(
        {
            edition: collectionMasterEditionAccount,
            metadata: collectionMetadataAccount,
            mint: collectionMint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            updateAuthority: payer.publicKey,
        },
        {
            createMasterEditionArgs: {
                maxSupply: 0,
            },
        },
        TOKEN_METADATA_PROGRAM_ID
    );

    const sizeCollectionIX = createSetCollectionSizeInstruction(
        {
            collectionAuthority: payer.publicKey,
            collectionMetadata: collectionMetadataAccount,
            collectionMint: collectionMint,
        },
        {
            setCollectionSizeArgs: { size: 10000 },
        },
        TOKEN_METADATA_PROGRAM_ID
    );

    let tx = new Transaction()
        .add(collectionMeatadataIX)
        .add(collectionMasterEditionIX)
        .add(sizeCollectionIX);
    try {
        await sendAndConfirmTransaction(connection, tx, [payer], {
            commitment: "confirmed",
        });

        // eslint-disable-next-line no-console
        console.log(
            "Successfull created NFT collection with collection address: " +
                collectionMint.toBase58()
        );
        return {
            collectionMasterEditionAccount,
            collectionMetadataAccount,
            collectionMint,
        };
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to init collection: ", e);
        throw e;
    }
    return new Response("uhh");
};
