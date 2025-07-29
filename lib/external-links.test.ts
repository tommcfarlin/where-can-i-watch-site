import {
  getIMDBLink,
  getExternalLinks,
  hasExternalLinks,
  getPrimaryExternalLink
} from './external-links';
import { ExternalIds } from '@/types/tmdb';

// Mock external IDs for testing
const mockExternalIds: ExternalIds = {
  id: 12345,
  imdb_id: 'tt1234567',
  facebook_id: null,
  instagram_id: null,
  twitter_id: null,
  wikidata_id: null,
};

const mockExternalIdsInvalid: ExternalIds = {
  id: 12345,
  imdb_id: 'invalid-id',
  facebook_id: null,
  instagram_id: null,
  twitter_id: null,
  wikidata_id: null,
};

const mockExternalIdsEmpty: ExternalIds = {
  id: 12345,
  imdb_id: null,
  facebook_id: null,
  instagram_id: null,
  twitter_id: null,
  wikidata_id: null,
};

describe('External Links', () => {
  describe('getIMDBLink', () => {
    it('should return IMDB link for valid ID', () => {
      const link = getIMDBLink(mockExternalIds);

      expect(link).not.toBeNull();
      expect(link?.name).toBe('IMDb');
      expect(link?.url).toBe('https://www.imdb.com/title/tt1234567');
      expect(link?.icon).toBe('📽️');
    });

    it('should return null for invalid IMDB ID', () => {
      const link = getIMDBLink(mockExternalIdsInvalid);
      expect(link).toBeNull();
    });

    it('should return null for missing IMDB ID', () => {
      const link = getIMDBLink(mockExternalIdsEmpty);
      expect(link).toBeNull();
    });

    it('should validate IMDB ID format strictly', () => {
      const testCases = [
        { imdb_id: 'tt1234567', valid: true },    // 7 digits
        { imdb_id: 'tt12345678', valid: true },   // 8 digits
        { imdb_id: 'tt123456', valid: false },    // 6 digits (too short)
        { imdb_id: 'tt123456789', valid: false }, // 9 digits (too long)
        { imdb_id: 'invalid', valid: false },     // Invalid format
        { imdb_id: '1234567', valid: false },     // Missing 'tt' prefix
        { imdb_id: 'tt', valid: false },          // Just prefix
      ];

      testCases.forEach(({ imdb_id, valid }) => {
        const testIds = { ...mockExternalIdsEmpty, imdb_id };
        const link = getIMDBLink(testIds);

        if (valid) {
          expect(link).not.toBeNull();
          expect(link?.url).toContain(imdb_id);
        } else {
          expect(link).toBeNull();
        }
      });
    });
  });

  describe('getExternalLinks', () => {
    it('should return array with IMDB link for valid data', () => {
      const links = getExternalLinks(mockExternalIds);

      expect(links).toHaveLength(1);
      expect(links[0].name).toBe('IMDb');
    });

    it('should return empty array for invalid data', () => {
      const links = getExternalLinks(mockExternalIdsInvalid);
      expect(links).toHaveLength(0);
    });

    it('should return empty array for missing data', () => {
      const links = getExternalLinks(mockExternalIdsEmpty);
      expect(links).toHaveLength(0);
    });

    it('should handle null/undefined input gracefully', () => {
      expect(getExternalLinks(null as any)).toEqual([]);
      expect(getExternalLinks(undefined as any)).toEqual([]);
      expect(getExternalLinks({} as any)).toEqual([]);
    });
  });

  describe('hasExternalLinks', () => {
    it('should return true when links are available', () => {
      expect(hasExternalLinks(mockExternalIds)).toBe(true);
    });

    it('should return false when no links are available', () => {
      expect(hasExternalLinks(mockExternalIdsEmpty)).toBe(false);
      expect(hasExternalLinks(mockExternalIdsInvalid)).toBe(false);
    });
  });

  describe('getPrimaryExternalLink', () => {
    it('should return IMDB link as primary', () => {
      const link = getPrimaryExternalLink(mockExternalIds);

      expect(link).not.toBeNull();
      expect(link?.name).toBe('IMDb');
    });

    it('should return null when no links available', () => {
      const link = getPrimaryExternalLink(mockExternalIdsEmpty);
      expect(link).toBeNull();
    });
  });
});