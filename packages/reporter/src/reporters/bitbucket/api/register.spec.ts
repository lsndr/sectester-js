import 'reflect-metadata';
import { BitbucketApiClient } from './BitbucketApiClient';

describe('Bitbucket Register', () => {
  describe('BitbucketApiClient', () => {
    it('should be defined', () => {
      expect(BitbucketApiClient).toBeDefined();
    });

    it('should have createOrUpdateReport method', () => {
      const client = new BitbucketApiClient({
        token: 'test-token',
        workspace: 'test-workspace',
        repoSlug: 'test-repo',
        commitSha: 'abc123'
      });

      expect(client.createOrUpdateReport).toBeDefined();
      expect(typeof client.createOrUpdateReport).toBe('function');
    });

    it('should have createAnnotations method', () => {
      const client = new BitbucketApiClient({
        token: 'test-token',
        workspace: 'test-workspace',
        repoSlug: 'test-repo',
        commitSha: 'abc123'
      });

      expect(client.createAnnotations).toBeDefined();
      expect(typeof client.createAnnotations).toBe('function');
    });
  });
});
