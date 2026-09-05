// Custom photo memes for chat — the Pasjonaci crew's own reaction pack,
// shown alongside quick reactions on tables created via /pasjonaci.
// Same shape as reactions.ts (see REACTION_IMAGE_SRC) but rendered larger,
// since these are full photos rather than small icons.
export const MEMES = ['facepalm', 'balaclava', 'confused', 'hottub', 'boss', 'blessing', 'badbeat', 'flex', 'moto'] as const;
export type Meme = typeof MEMES[number];

export const MEME_IMAGE_SRC: Record<Meme, string> = {
  facepalm: '/memes/facepalm.jpg',
  balaclava: '/memes/balaclava.jpg',
  confused: '/memes/confused.jpg',
  hottub: '/memes/hottub.jpg',
  boss: '/memes/boss.jpg',
  blessing: '/memes/blessing.jpg',
  badbeat: '/memes/badbeat.jpg',
  flex: '/memes/flex.jpg',
  moto: '/memes/moto.jpg',
};

export const MEME_LABEL: Record<Meme, string> = {
  facepalm: 'Facepalm',
  balaclava: 'Balaclava',
  confused: 'Confused',
  hottub: 'Chill',
  boss: 'Boss',
  blessing: 'Blessing',
  badbeat: 'Bad Beat',
  flex: 'Flex',
  moto: 'Moto',
};
