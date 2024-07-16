import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { abi } from '../abi.js';
import type { Address } from 'viem';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  title: 'Suspended - Chapter 4 - The contact',
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame('/', (c) => {
  return c.res({
    action: "/second",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/1.png",
    intents: [
      <Button action='/second'>next</Button>,
    ],
  });
});

app.frame('/second', (c) => {
  return c.res({
    action: "/third",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/2.png",
    intents: [
      <Button action='/'>Back</Button>,
      <Button action='/third'>Next</Button>, // Corrected here
    ],
  });
});

app.frame('/third', (c) => {
  return c.res({
    action: "/fourth",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/3.png",
    intents: [
      <Button action='/second'>Back</Button>,
      <Button action='/fourth'>Next</Button>, // Corrected here
    ],
  });
});

app.frame('/fourth', (c) => {
  return c.res({
    action: "/fifth",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/4.png",
    intents: [
      <Button action='/third'>Back</Button>,
      <Button action='/fifth'>Next</Button>,
    ],
  });
});

app.frame('/fifth', (c) => {
  return c.res({
    action: "/sixth",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/5.png",
    intents: [
      <Button action='/fourth'>Back</Button>,
      <Button action='/sixth'>Next</Button>,
    ],
  });
});

app.frame('/sixth', (c) => {
  return c.res({
    action: "/finish",
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/6.png",
    intents: [
      <Button action='/fifth'>Back</Button>,
      <Button.Transaction target="/mint">Mint Z-42 NFT</Button.Transaction>,
    ],
  });
});

app.frame('/finish', (c) => {
  return c.res({
    image: "https://bafybeiexjn4b7ewg2a7embuyrfooxqk7nsbkds3chcbqdgxkz3gbbybmuq.ipfs.dweb.link/7.png",
    intents: [
      <Button.Link href="https://warpcast.com/pablodrum/0x943dbb74">Go to chapter Three</Button.Link>
    ],
  });
});


app.transaction('/mint', (c) => {
  const address = c.address as Address;
  console.log('address', address);
  const tokenId = 0;
  const uri = 'ipfs://QmawwR2YjAeZ3Kr3qQ2mC1Gj35hHiWD4wsvz5AMHKgGLLr'; // Fixed URI

  console.log('address', address);
  console.log('tokenId', tokenId);
  console.log('uri', uri);

  // Contract transaction response.
  return c.contract({
    abi,
    chainId: 'eip155:42161', // arbitrum one
    functionName: 'safeMint',
    args: [address, uri],
    to: '0x3f9C63aff2Ad72E2f98C9FFe7289d636d4F1A901' // arbitrum one
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
