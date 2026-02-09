import type { FeaturamaConfig } from '@featurama/react-native';

/**
 * Mutable configuration for the Featurama SDK.
 * Update these values from the Settings tab and restart the app to apply.
 */
export const config: FeaturamaConfig = {
  apiKey: 'fm_live_test_key_placeholder_00',
  baseUrl: 'http://localhost:5001',
};

/**
 * User identifier for this test app session.
 * Used as submitterIdentifier when creating requests and as voterIdentifier when voting.
 */
export const USER_ID = `rn_test_user_${Date.now()}`;
