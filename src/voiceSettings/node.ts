import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { execFile } from 'child_process';

const expectedHash = 'a8e30688319b22f029007d057369e4b12f83fe6cbfaf675280de0461ad007f30';
const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
const discordPath = path.join(localAppData, 'Discord');

function getLatestDiscordAppPath(): string | null {
  if (!fs.existsSync(discordPath)) return null;

  const dirs = fs.readdirSync(discordPath)
    .filter(name => fs.statSync(path.join(discordPath, name)).isDirectory() && name.startsWith('app-'))
    .map(name => ({ name, version: name.replace('app-', '') }));

  if (dirs.length === 0) return null;

  dirs.sort((a, b) => {
    const aParts = a.version.split('.').map(Number);
    const bParts = b.version.split('.').map(Number);
    const len = Math.max(aParts.length, bParts.length);
    for (let i = 0; i < len; i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;
      if (aNum !== bNum) return bNum - aNum;
    }
    return 0;
  });

  return path.join(discordPath, dirs[0].name, 'modules', 'discord_voice-1', 'discord_voice');
}


console.log(getLatestDiscordAppPath());

function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function main() {
  const targetDir = getLatestDiscordAppPath();
  if (!targetDir) {
    console.error('No valid Discord app directory found.');
    return;
  }

  const nodeFilePath = path.join(targetDir, 'discord_voice.node');

  try {
    const currentHash = await sha256File(nodeFilePath).catch(() => '');
    console.log(currentHash);
    if (currentHash === expectedHash) {
        console.log('File is up-to-date.');
    } else {
        console.log('diddy');
        setTimeout(() => {
            const fixPath = moonlightNode.getConfigOption<string>("voiceSettings", "fixerPath") ?? "";
            console.log(fixPath);
            execFile(fixPath);
        }, 5000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
