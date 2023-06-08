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
import { json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
    return new Response(
        JSON.stringify({
            icon: "https://shdw-drive.genesysgo.net/7LsXy7eqD3RGuKXxmwE245akJeZURRSgN8vAuYWdS5JF/banana.png",
            label: "Compressed Banana",
        })
    );
};

export const POST = async ({ request }) => {
    const body = await request.json();

    const connection = new Connection("https://api.mainnet-beta.solana.com");

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
    const [collectionMetadataAccount, _b1] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf8"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            collectionMint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    const [collectionEditionAccount, _b2] = PublicKey.findProgramAddressSync(
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
            leafOwner: new PublicKey(body.account),
            logWrapper: SPL_NOOP_PROGRAM_ID,
            merkleTree: merkleTree.publicKey,
            payer: new PublicKey(body.account),
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

    transaction.partialSign(keypair);

    const serialized = Buffer.from(
        transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
        })
    ).toString("base64");

    const message = "Mint a Compressed Banana by @_qudo!";

    return new Response(JSON.stringify({ message, transaction: serialized }));
};
