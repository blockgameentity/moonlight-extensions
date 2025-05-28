/* eslint-disable prettier/prettier */
import type { ExtensionWebExports } from "@moonlight-mod/types";

const downmix = () => moonlight.getConfigOption<boolean>("voiceSettings", "downmix") ?? false;
const stereo = () => moonlight.getConfigOption<boolean>("voiceSettings", "stereo") ?? false;
const voiceBitrate = moonlight.getConfigOption<number>("voiceSettings", "voiceBitrate");

export const patches: ExtensionWebExports["patches"] = [
  {
    find: "}getCodecOptions(",
    replace: {
      match: 'req:48e3,channels:2,params:{stereo:"1"}',
      replacement: 'req:48e3,channels:2,params:{stereo:"0"}'
    },
    prerequisite: downmix
  },
  {
    find: "}getCodecOptions(",
    replace: {
        match: "freq:48e3,pacsize:960,channels:1,rate:64e3",
        replacement: 'freq:48e3,pacsize:960,channels:2,params:{stereo:"1"},rate:64e3'
    },
    prerequisite: stereo
  },
  {
    find: "}getConnectionTransportOptions(",
    replace: {
        match: /qos:([^,]+),prioritySpeakerDucking:([^,]+),encodingVoiceBitRate:([^,]+),/,
        replacement: "qos:$1,prioritySpeakerDucking:$2,encodingVoiceBitRate:" + voiceBitrate + ","
    },
  }
];