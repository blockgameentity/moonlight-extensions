import type { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [
    {
        find: "}voiceStateUpdate(",
        replace: {
            match: /self_mute:([^,]+),self_deaf:([^,]+),self_video:([^,]+)/,
            replacement: "self_mute:require('fakeDeafen_entrypoint').Toggle($1, 'mute'),self_deaf:require('fakeDeafen_entrypoint').Toggle($2, 'deaf'),self_video:require('fakeDeafen_entrypoint').Toggle($3, 'video')"
        }
    },
    {
        find: "shouldShowSpeakingWhileMutedTooltip",
        replace: {
            match: /className:\i\.buttons,.{0,50}children:\[/,
            replacement: "$&require('fakeDeafen_entrypoint').FakeDeafenButton(),"
        }
    }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
    entrypoint: {
        dependencies: [
            'react',
            {
                ext: 'spacepack',
                id: 'spacepack',
            },
            {
                ext: 'common',
                id: 'ErrorBoundary',
            }
        ],
    }
};