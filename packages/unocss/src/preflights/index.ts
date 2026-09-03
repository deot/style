import type { Preflight } from 'unocss';
import type { ResolvedPresetStyleOptions } from '../types';
import { createResetPreflight } from './reset';
import { createVariablesPreflight } from './variables';

export const createPreflights = (options: ResolvedPresetStyleOptions): Preflight[] => [
	createVariablesPreflight(options),
	...(options.reset ? [createResetPreflight()] : [])
];
