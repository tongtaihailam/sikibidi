const mineflayer = require('mineflayer');
const fs = require('fs');
const Vec3 = require('vec3');

const inputFile = './input.txt';
let bot;

// Patch Vec3 to avoid crash from broken explosion packets
const originalVec3Add = Vec3.prototype.add;
Vec3.prototype.add = function (other) {
  if (!other || typeof other.x !== 'number' || typeof other.y !== 'number' || typeof other.z !== 'number') {
    return this.clone();
  }
  return originalVec3Add.call(this, other);
};

function startBot() {
  try {
    bot = mineflayer.createBot({
      host: 'ls-business.aternos.me',
      port: 27344,
      username: 'LordSoul',
      version: '1.21.4'
    });

    bot.once('spawn', () => {
      console.log('✅ Bot has spawned.');

      // Optional: stop crashy packets
      bot._client.removeAllListeners('explosion');

      // Movement loop
      setInterval(() => {
        bot.setControlState('jump', true);
        bot.setControlState('forward', true);
        bot.setControlState('right', true);
        if (bot.entity) {
          bot.look(bot.entity.yaw + 0.2, 0, true);
        }
      }, 100);

      // Leave after 10 minutes
      setTimeout(() => {
        console.log('[INFO] Leaving server after 10 minutes.');
        bot.quit('Timed disconnect');
      }, 10 * 60 * 1000);

      // Begin reading input.txt
      pollInputFile();
    });

    bot.on('end', () => {
      console.log('[INFO] Bot disconnected. Rejoining in 15 seconds...');
      setTimeout(startBot, 15000);
    });

    bot.on('error', err => {
      console.error('[BOT ERROR]', err.message);
      console.log('[INFO] Retrying in 15 seconds...');
      setTimeout(startBot, 15000);
    });

  } catch (err) {
    console.error('[CRASHED]', err.message);
    console.log('[INFO] Retrying in 15 seconds...');
    setTimeout(startBot, 15000);
  }
}

function pollInputFile() {
  setInterval(() => {
    if (!bot || !bot.chat) return;

    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err || !data.trim()) return;

      const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length === 0) return;

      // Send all lines immediately
      for (const line of lines) {
        try {
          bot.chat(line);
        } catch (e) {
          console.warn('[WARN] Failed to send:', line);
        }
      }

      // Clear file after sending
      fs.writeFileSync(inputFile, '');
    });
  }, 1000); // Check every 1 second
}

startBot();
