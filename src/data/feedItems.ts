import type { FeedItem } from '../types/feedItem';

/**
 * Live action feed — add new entries at the TOP (newest first).
 * imageUrl paths are relative to the public/ folder.
 *
 * To add an update: prepend a new object and redeploy.
 */
export const feedItems: FeedItem[] = [
  {
    id: 'update-arrive-salina',
    title: '🦈 The shark has landed in Salina!',
    body: 'After two days on the road, the shark tunnel has arrived at the Zoetis Building in Salina, KS. The Kansas KidWind State Challenge starts tomorrow — we can\'t wait to see what teams have built!',
    publishedAt: new Date('2026-04-11T15:00:00-05:00'),
    relatedStopId: 'salina',
  },
  {
    id: 'update-kansas-city',
    title: 'Hello, Kansas City!',
    body: 'The crew stopped in KC for a quick photo at the state line sign. Barbecue for lunch, then back on the road to Emporia. Salina is so close!',
    publishedAt: new Date('2026-04-11T10:15:00-05:00'),
    relatedStopId: 'kansas-city',
  },
  {
    id: 'update-overnight-kirksville',
    title: 'Day 1 complete — overnight in Kirksville',
    body: 'What a drive! The team made it through Wisconsin and Iowa and is resting up in Kirksville, MO tonight. The shark is already excited for Day 2.',
    publishedAt: new Date('2026-04-10T19:00:00-05:00'),
    relatedStopId: 'kirksville',
  },
  {
    id: 'update-iowa-city',
    title: 'Greetings from Iowa City, IA!',
    body: 'Stopped at a school in Iowa City to talk about wind energy with some young engineers. Their questions were amazing — future KidWind champions for sure!',
    publishedAt: new Date('2026-04-10T11:30:00-05:00'),
    relatedStopId: 'iowa-city',
  },
  {
    id: 'update-departure',
    title: '🚛 We\'re rolling! The shark tunnel has left Mineral Point.',
    body: 'The journey to Salina, Kansas officially began this morning at 8am. The shark tunnel is loaded up and ready to make the 630-mile trek to the Kansas KidWind State Challenge. Follow along for live updates!',
    publishedAt: new Date('2026-04-10T08:15:00-05:00'),
    relatedStopId: 'mineral-point',
  },
];
