/**
 * Franchise keyword mappings for enhanced search
 * Maps franchise search terms to related content that might not contain the franchise name
 */

export interface FranchiseMapping {
  keywords: string[];
  relatedTitles: string[];
  tmdbKeywordIds?: number[];
}

export const franchiseMappings: Record<string, FranchiseMapping> = {
  'star wars': {
    keywords: ['star wars', 'jedi', 'sith', 'force', 'galaxy far far away'],
    relatedTitles: [
      'Andor',
      'The Mandalorian',
      'Obi-Wan Kenobi',
      'The Book of Boba Fett',
      'Ahsoka',
      'The Acolyte',
      'Skeleton Crew',
      'The Bad Batch'
    ],
    tmdbKeywordIds: [350768] // star wars keyword ID
  },
  'marvel': {
    keywords: ['marvel', 'mcu', 'avengers', 'superhero'],
    relatedTitles: [
      'Loki',
      'WandaVision',
      'The Falcon and the Winter Soldier',
      'Hawkeye',
      'Moon Knight',
      'Ms. Marvel',
      'She-Hulk',
      'Secret Invasion',
      'Echo',
      'What If...?'
    ],
    tmdbKeywordIds: [180547] // marvel cinematic universe
  },
  'dc': {
    keywords: ['dc', 'batman', 'superman', 'justice league'],
    relatedTitles: [
      'Peacemaker',
      'Titans',
      'Doom Patrol',
      'Harley Quinn',
      'Young Justice',
      'Pennyworth'
    ]
  },
  'lord of the rings': {
    keywords: ['lord of the rings', 'lotr', 'middle earth', 'tolkien'],
    relatedTitles: [
      'The Rings of Power',
      'The Hobbit'
    ]
  },
  'game of thrones': {
    keywords: ['game of thrones', 'got', 'westeros'],
    relatedTitles: [
      'House of the Dragon',
      'The Hedge Knight'
    ]
  }
};

/**
 * Check if a search query matches any franchise
 */
export function detectFranchise(query: string): string | null {
  const normalizedQuery = query.toLowerCase();

  for (const [franchise, mapping] of Object.entries(franchiseMappings)) {
    // Check if query contains any franchise keywords
    if (mapping.keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return franchise;
    }
  }

  return null;
}

/**
 * Get additional search terms for a detected franchise
 */
export function getFranchiseSearchTerms(franchise: string): string[] {
  const mapping = franchiseMappings[franchise];
  return mapping ? mapping.relatedTitles : [];
}