// import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
// import { ParticleProvider } from "@particle-network/provider";

const auth = require('@particle-network/auth');
const provider = require('@particle-network/provider');
// const solana = require('@particle-network/solana-wallet');
// import { Solana } from '@particle-network/chains';
// import { SolanaWallet } from '@particle-network/solana-wallet';

// const pn = new auth.ParticleNetwork({
//     projectId: "642051a9-9a72-4386-8561-0bc24fdc4478",
//     clientKey: "crFGCOsLvF09N2BaaGufCVe7Lxb3YUwmHsXGx7mI",
//     appId: "d9d43649-4d3e-4800-89a9-e5b28d77b8ff",
//     chainName: "BSC", //optional: current chain name, default Ethereum.
//     chainId: 97, //optional: current chain id, default 1.
//     // wallet: {   //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
//     //   displayWalletEntry: true,  //show wallet entry when connect particle.
//     //   defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
//     //   supportChains: [{ id: 56, name: "BSC"}, { id: 97, name: "BSC"}], // optional: web wallet support chains.
//     //   customStyle: {}, //optional: custom wallet style
//     // }
//   });

const pn = new auth.ParticleNetwork({
    projectId: 'ff93f2f5-f6dc-4df7-8514-71f73a6e4249',
    clientKey: 'cItuAabfyD1mYJFGbo4YO5MvXal0LgXDTgxtykQ0',
    appId: 'e8e8f051-9d99-4245-b46e-60c71315e6e3',
    // chainName: 'ETH', //optional: current chain name, default Ethereum.
    // chainId: 1 //optional: current chain id, default 1.
    wallet: {
        //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
        // displayWalletEntry: true,  //show wallet entry when connect particle.
        // defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
        // supportChains: [{ id: 56, name: "BSC"}, { id: 97, name: "BSC"}], // optional: web wallet support chains.
        displayWalletEntry: false,
        uiMode: 'light',
        customStyle: {
            light: {
                colorAccent: '#FB6D3A',
                colorPrimary: 'rgba(255,255,255, 1)',
                colorOnPrimary: '#ffffff',
                primaryButtonBackgroundColors: ['#000000', '#000000'],
                primaryButtonTextColor: '#ffffff',
                primaryIconButtonBackgroundColors: ['#FFF0EB', 'rgba(0,0,0,0)'],
                cancelButtonBackgroundColor: '#666666',
                backgroundColors: [
                    '#FCF8FD',
                    [
                        ['rgba(72,11,11,0)', '#ffffff00'],
                        ['#ffffff00', '#ffffff00']
                    ]
                ],
                messageColors: ['#09A12A', '#CC3847'],
                borderGlowColors: ['#7bd5f940', '#323233'],
                modalMaskBackgroundColor: '#141430b3'
            },
            dark: {
                colorAccent: '#7DD5F9',
                colorPrimary: '#21213a',
                colorOnPrimary: '#171728',
                primaryButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
                primaryIconButtonBackgroundColors: ['#5ED7FF', '#E89DE7'],
                primaryButtonTextColor: '#0A1161',
                cancelButtonBackgroundColor: '#666666',
                backgroundColors: [
                    'rgba(0,0,0,0)',
                    [
                        ['#e6b1f766', '#e6b1f700'],
                        ['#7dd5f94d', '#7dd5f900']
                    ]
                ],
                messageColors: ['#09A12A', '#CC3847'],
                borderGlowColors: ['#7bd5f940', '#323233'],
                modalMaskBackgroundColor: '#141430b3'
            }
        } //optional: custom wallet style
    }
});

const particleProvider = new provider.ParticleProvider(pn.auth);
//if you need support solana chain

// let solanaWallet: any;
// if (typeof window !== 'undefined') {
//   solanaWallet = new solana.SolanaWallet(pn.auth);
// }

// const _ParticleNetwork = { particleProvider, pn, solanaWallet };
const _ParticleNetwork = { particleProvider, pn };
export default _ParticleNetwork;
