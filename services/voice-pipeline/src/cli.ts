import readline from 'readline';
import { handleIncomingCall, executeVoiceTurn } from './index';
import { sessionManager } from './state/manager';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log('\n===============================================================');
  console.log('🌾 KisanCall Voice AI Pipeline — Interactive Test Harness 🌾');
  console.log('===============================================================');
  console.log('Running in Full Simulation Mode (Mock Tools + Terminal STT/TTS)');
  console.log('Type your questions in Hindi or English (e.g., "mera number kab aayega?")');
  console.log('Commands:');
  console.log('  :lang hi  -> Switch language to Hindi');
  console.log('  :lang en  -> Switch language to English');
  console.log('  :barge    -> Simulate user barge-in (interruption)');
  console.log('  :exit     -> Exit test harness\n');

  const callId = `SIM-CALL-${Date.now()}`;
  const farmerPhone = '+919876543210';

  await handleIncomingCall({ callId, from: farmerPhone });
  const session = sessionManager.getOrCreateSession(callId, farmerPhone);

  console.log(`[Connected Call] ID: ${callId} | Phone: ${farmerPhone}`);
  console.log(`[Farmer Profile] Name: ${session.context.name} | Mandi: ${session.context.preferredMandi} | Language: ${session.context.language.toUpperCase()}\n`);

  const promptUser = () => {
    const langBadge = session.context.language.toUpperCase();
    rl.question(`\n[Farmer Speech Input (${langBadge})]: `, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        promptUser();
        return;
      }

      if (trimmed === ':exit') {
        console.log('\nEnding call session. Goodbye!');
        rl.close();
        process.exit(0);
      }

      if (trimmed.startsWith(':lang ')) {
        const newLang = trimmed.split(' ')[1]?.toLowerCase();
        if (newLang === 'hi' || newLang === 'en') {
          sessionManager.setLanguage(callId, newLang as 'hi' | 'en');
          console.log(`\n✓ Switched language to ${newLang.toUpperCase()}`);
        } else {
          console.log('\nInvalid language! Use :lang hi or :lang en');
        }
        promptUser();
        return;
      }

      if (trimmed === ':barge') {
        sessionManager.handleUserInterruption(callId);
        promptUser();
        return;
      }

      try {
        const result = await executeVoiceTurn(callId, trimmed);
        console.log(`[Tools Invoked]: ${result.toolCalls.length ? result.toolCalls.join(', ') : 'None'}`);
      } catch (err: any) {
        console.error('[Error processing turn]:', err.message);
      }

      promptUser();
    });
  };

  promptUser();
}

main().catch((err) => {
  console.error('Fatal error in Test Harness:', err);
  process.exit(1);
});
