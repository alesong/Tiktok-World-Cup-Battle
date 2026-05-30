import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_SETTINGS: { key: string; value: string }[] = [
  { key: 'admin_password', value: 'admin123' },
  { key: 'goal_distance_diamonds', value: '200' },
  { key: 'goal_distance_pixels', value: '600' },
  { key: 'match_mode', value: 'goals' },
  { key: 'match_limit', value: '3' },
  { key: 'volume', value: '0.5' },
  { key: 'event_multiplier', value: '1' },
  { key: 'event_gold_goal', value: 'false' },
  { key: 'event_penalty', value: 'none' },
  { key: 'event_turbo', value: 'false' },
  { key: 'local_team_id', value: 'ARG' },
  { key: 'visitor_team_id', value: 'BRA' },
  { key: 'local_score', value: '0' },
  { key: 'visitor_score', value: '0' },
  { key: 'ball_progress', value: '0' },
  { key: 'match_state', value: 'idle' },
  { key: 'overlay_resolution', value: '1920x1080' },
  { key: 'gift_values', value: '{"Rosa":1,"TikTok":1,"Perfume":20,"Corazon":5,"Sombrero":99,"Leon":29999,"Universo":34999}' },
];

const DEFAULT_TEAMS: { id: string; name: string; flag: string; primaryColor: string; secondaryColor: string; jerseyColor: string }[] = [
  { id: 'ARG', name: 'Argentina', flag: '🇦🇷', primaryColor: '#74ACDF', secondaryColor: '#FFFFFF', jerseyColor: '#74ACDF' },
  { id: 'BRA', name: 'Brasil', flag: '🇧🇷', primaryColor: '#FEDF00', secondaryColor: '#009739', jerseyColor: '#FEDF00' },
  { id: 'COL', name: 'Colombia', flag: '🇨🇴', primaryColor: '#FCD116', secondaryColor: '#003893', jerseyColor: '#FCD116' },
  { id: 'FRA', name: 'Francia', flag: '🇫🇷', primaryColor: '#002395', secondaryColor: '#ED2939', jerseyColor: '#002395' },
  { id: 'ESP', name: 'España', flag: '🇪🇸', primaryColor: '#C60B1E', secondaryColor: '#F1BF00', jerseyColor: '#C60B1E' },
  { id: 'GER', name: 'Alemania', flag: '🇩🇪', primaryColor: '#000000', secondaryColor: '#DD0000', jerseyColor: '#FFFFFF' },
  { id: 'POR', name: 'Portugal', flag: '🇵🇹', primaryColor: '#046A38', secondaryColor: '#DA291C', jerseyColor: '#DA291C' },
  { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primaryColor: '#FFFFFF', secondaryColor: '#CF081F', jerseyColor: '#FFFFFF' },
  { id: 'URU', name: 'Uruguay', flag: '🇺🇾', primaryColor: '#007FFF', secondaryColor: '#FFFFFF', jerseyColor: '#007FFF' },
  { id: 'MEX', name: 'México', flag: '🇲🇽', primaryColor: '#006847', secondaryColor: '#C8102E', jerseyColor: '#006847' },
  { id: 'JPN', name: 'Japón', flag: '🇯🇵', primaryColor: '#00005F', secondaryColor: '#FFFFFF', jerseyColor: '#00005F' },
  { id: 'MAR', name: 'Marruecos', flag: '🇲🇦', primaryColor: '#C1272D', secondaryColor: '#006233', jerseyColor: '#C1272D' },
];

async function main() {
  const settingCount = await prisma.twcSetting.count();
  if (settingCount === 0) {
    for (const s of DEFAULT_SETTINGS) {
      await prisma.twcSetting.upsert({
        where: { key: s.key },
        create: s,
        update: s,
      });
    }
    console.log(`Seeded ${DEFAULT_SETTINGS.length} settings.`);
  }

  const teamCount = await prisma.twcTeam.count();
  if (teamCount === 0) {
    for (const t of DEFAULT_TEAMS) {
      await prisma.twcTeam.upsert({
        where: { id: t.id },
        create: t,
        update: t,
      });
    }
    console.log(`Seeded ${DEFAULT_TEAMS.length} teams.`);
  }
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
