import type { ComponentType } from "svelte";

import type { IconPaths, modals } from "$lib/config";

export * from "$lib/config";

export type Icon = keyof typeof IconPaths;

export interface Modal {
    title: string;
    component: ComponentType;
    showClose?: boolean;
    fullscreen?: boolean;
    props?: Record<string, any>;
}

export type Modals = keyof typeof modals;
