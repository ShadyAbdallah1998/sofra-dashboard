/**
 * FEATURE STORE TEMPLATE
 * 
 * Instructions:
 * 1. Copy this file and rename to {feature}Store.ts
 * 2. Replace all instances of "Feature" with your feature name
 * 3. Update types to match your feature's data structure
 * 4. Implement your feature-specific actions
 * 5. Delete this comment block
 */

import { create, StoreApi } from 'zustand';
// import { featureService } from '@/services/featureService';
import { reportError } from '@/lib/utils';
// import type { FeatureType } from '@/types/feature.types';

type FeatureState = {
    data: any | null; // Replace 'any' with your feature type
    isLoading: boolean;
    error: Error | undefined;
    // Add feature-specific state properties here
};

type FeatureActions = {
    getData: () => Promise<void>;
    updateData: (data: any) => Promise<void>; // Replace 'any' with your feature type
    clearError: () => void;
    reset: () => void;
    // Add feature-specific actions here
};

const initialState: FeatureState = {
    data: null,
    isLoading: false,
    error: undefined,
};

export const useFeatureStore = create<FeatureState & FeatureActions>(
    (
        set: StoreApi<FeatureState & FeatureActions>['setState'],
        get: StoreApi<FeatureState & FeatureActions>['getState']
    ) => ({
        ...initialState,

        getData: async () => {
            set({ isLoading: true, error: undefined });
            try {
                // const data = await featureService.getData();
                // set({ data, isLoading: false });

                // Temporary placeholder
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'FeatureStore.getData' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        updateData: async (data: any) => {
            set({ isLoading: true, error: undefined });
            try {
                // await featureService.updateData(data);
                // set({ data, isLoading: false });

                // Temporary placeholder
                set({ isLoading: false });
            } catch (err) {
                const error = err as Error;
                reportError(error, { componentStack: 'FeatureStore.updateData' });
                set({ error, isLoading: false });
                throw error;
            }
        },

        clearError: () => set({ error: undefined }),

        reset: () => set(initialState),
    })
);
