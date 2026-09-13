const fs = require('fs');

function processFile(path, compName) {
  let content = fs.readFileSync(path, 'utf8');
  content = '"use client";\n' + content;
  content = content.replace(/import Sidebar from "\.\/Sidebar";\n/, '');
  
  // Remove TopBar function block correctly
  // Instead of greedy match, let's find function TopBar and then its closing bracket.
  // The simplest is to just remove between `function TopBar` and `/* ══════` or `export default function`
  const topBarRegex = /function TopBar\([\s\S]*?(?=\/\* ════════|export default function)/;
  content = content.replace(topBarRegex, '');
  
  // Replace the component definition signature
  const regexComp = new RegExp('export default function ' + compName + '\\([\\s\\S]*?\\) {');
  content = content.replace(regexComp, 'export default function ' + compName + 'Content() {');
  
  // Remove the layout wrapper
  const wrapperStart = /<div className="flex h-screen overflow-hidden"[\s\S]*?<main className="flex-1 overflow-y-auto px-[0-9]+ py-[0-9]+.*?>/;
  content = content.replace(wrapperStart, '<>');
  
  // Remove the ending tags
  const wrapperEnd = /<\/main>\s*<\/div>\s*<\/div>/;
  content = content.replace(wrapperEnd, '</>');
  
  fs.writeFileSync(path, content);
}

processFile('c:/Users/Vansh Bhatia/kisancallpw/apps/farmer-web/src/components/farmer/PaymentContent.tsx', 'Payment');
processFile('c:/Users/Vansh Bhatia/kisancallpw/apps/farmer-web/src/components/farmer/RegisterProcurementContent.tsx', 'RegisterProcurement');
