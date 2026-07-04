// Quick-tap chat reactions. Rendered as actual glossy 3D icons (Microsoft's
// MIT-licensed Fluent Emoji 3D set — https://github.com/microsoft/fluentui-emoji)
// instead of native Unicode emoji, so they look the same on every device
// instead of depending on whatever emoji font the OS happens to ship.
export const QUICK_REACTIONS = ['pride', 'laughter', 'crying', 'rocket', 'anger'] as const;
export type QuickReaction = typeof QUICK_REACTIONS[number];

export const REACTION_IMAGE_SRC: Record<QuickReaction, string> = {
  pride: '/reactions/pride.png',
  laughter: '/reactions/laughter.png',
  crying: '/reactions/crying.png',
  rocket: '/reactions/rocket.png',
  anger: '/reactions/anger.png',
};

export const REACTION_LABEL: Record<QuickReaction, string> = {
  pride: 'Proud',
  laughter: 'Laughing',
  crying: 'Crying',
  rocket: 'Rocket',
  anger: 'Angry',
};
