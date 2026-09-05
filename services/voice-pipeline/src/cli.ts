import readline from 'readline';
import { handleIncomingCall, executeVoiceTurn } from './index';
import { sessionManager } from './state/manager';


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
  const farmerPhone = process.env.TEST_FARMER_PHONE || '+919999999999';
  const defaultFarmerId = process.env.TEST_FARMER_ID || 'd16486e6-0b85-4d03-9778-11498d8e7523';

  await handleIncomingCall({ callId, from: farmerPhone });
  const session = sessionManager.getOrCreateSession(callId, farmerPhone);
  if (defaultFarmerId && (!session.context.farmerId || session.context.farmerId.startsWith('FARMER-'))) {
    session.context.farmerId = defaultFarmerId;
  }

  console.log(`[Connected Call] ID: ${callId} | Phone: ${farmerPhone} | Farmer ID: ${session.context.farmerId}`);
  console.log(`[Farmer Profile] Name: ${session.context.name} | Mandi: ${session.context.preferredMandi} | Language: ${session.context.language.toUpperCase()}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY),
  });

  const printPrompt = () => {
    const langBadge = session.context.language.toUpperCase();
    process.stdout.write(`\n[Farmer Speech Input (${langBadge})]: `);
  };

  printPrompt();

  for await (const input of rl) {
    const trimmed = input.trim();

    if (!trimmed) {
      printPrompt();
      continue;
    }

    if (trimmed === ':exit') {
      console.log('\nEnding call session. Goodbye!');
      break;
    }

    if (trimmed.startsWith(':lang ')) {
      const newLang = trimmed.split(' ')[1]?.toLowerCase();
      if (newLang === 'hi' || newLang === 'en') {
        sessionManager.setLanguage(callId, newLang as 'hi' | 'en');
        console.log(`\n✓ Switched language to ${newLang.toUpperCase()}`);
      } else {
        console.log('\nInvalid language! Use :lang hi or :lang en');
      }
      printPrompt();
      continue;
    }

    if (trimmed === ':barge') {
      sessionManager.handleUserInterruption(callId);
      printPrompt();
      continue;
    }

    try {
      const result = await executeVoiceTurn(callId, trimmed);
      console.log(`[Tools Invoked]: ${result.toolCalls.length ? result.toolCalls.join(', ') : 'None'}`);
    } catch (err: any) {
      console.error('[Error processing turn]:', err.message);
    }

    printPrompt();
  }
}

main().catch((err) => {
  console.error('Fatal error in Test Harness:', err);
  process.exit(1);
});
