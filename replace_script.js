const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'app/dashboard/page.tsx',
  'app/docs/page.tsx',
  'app/faq/page.tsx',
  'app/page.tsx',
  'components/dashboard/ui/SmartTrackingModal.tsx',
  'components/dashboard/views/DailyCheckIn.tsx',
  'components/dashboard/views/DashboardHome.tsx',
  'components/dashboard/views/GlobalForge.tsx',
  'lib/database.types.ts',
  'components/dashboard/types.ts',
  'components/dashboard/layout/Sidebar.tsx',
  'components/dashboard/constants.ts'
];

filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Rename variables and database columns
    content = content.replace(/radarNotes/g, 'siegeNotes');
    content = content.replace(/setRadarNotes/g, 'setSiegeNotes');
    content = content.replace(/radar_notes/g, 'siege_notes');

    // Replace string literals and types
    content = content.replace(/"radar"/g, '"siege"');
    content = content.replace(/'radar'/g, "'siege'");
    content = content.replace(/`radar`/g, '`siege`');
    content = content.replace(/radar/g, 'siege');
    
    // Careful with Radar -> Siege for words and Engine
    content = content.replace(/Radar Engine/g, 'Siege Engine');
    content = content.replace(/Radar/g, 'Siege');
    
    // Icons: Lucide-react import
    // "Siege" is not a lucide icon, we will use "Flame"
    // Wait, the above replaced 'Radar' with 'Siege'. So if there was <Radar/> it became <Siege/>
    // Let's replace <Siege size with <Flame size
    content = content.replace(/<Siege size/g, '<Flame size');
    content = content.replace(/<Siege className/g, '<Flame className');
    // Also the import: import { ..., Siege, ... } from "lucide-react" -> import { ..., Flame, ... } from "lucide-react"
    // To handle this safely, we can just replace 'Siege' with 'Flame' in the import statement.
    content = content.replace(/import \{([^}]*)Siege([^}]*)\} from ("|')lucide-react("|')/g, (match, p1, p2, p3, p4) => {
        return `import {${p1}Flame${p2}} from ${p3}lucide-react${p4}`;
    });
    
    // We also need to fix app/page.tsx because it might use <Siege size={16} /> or icon: Siege
    content = content.replace(/icon: Siege,/g, 'icon: Flame,');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Processed ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
