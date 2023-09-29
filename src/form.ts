import {FileDropzoneType, FileDropzoneValue, NoFileDropzoneValue} from "./components/FileDropzone.tsx";

interface PartialSelectablePatchOptions<T extends Record<string, string>> {
    label: string,
    options: T,
    requires?: (data: AppFormData) => boolean,
    defaultValue?: keyof T
}

export type SelectablePatchOptions<T extends Record<string, string>> = Required<PartialSelectablePatchOptions<T>>;


function selectablePatch<T extends Record<string, string>>({
                                                               defaultValue,
                                                               label,
                                                               options,
                                                               requires
                                                           }: PartialSelectablePatchOptions<T>): SelectablePatchOptions<T> {
    return {
        label,
        options,
        requires: requires ?? (() => true),
        defaultValue: defaultValue ?? Object.keys(options)[0]
    };
}

function selectablePatches<T extends Record<string, PartialSelectablePatchOptions<Record<string, string>>>>(options: T): {
    [key in keyof T]: SelectablePatchOptions<T[key]["options"]>
} {
    return Object.fromEntries(
        Object.entries(options)
            .map(([k, v]) => [k, selectablePatch(v)])
    ) as ReturnType<typeof selectablePatches<T>>
}



interface PartialToggleablePatchOptions {
    label: string,
    defaultValue?: boolean,
    requires?: (data: AppFormData) => boolean,
}

export type ToggleablePatchOptions = Required<PartialToggleablePatchOptions>

function toggleablePatch({defaultValue, label, requires}: PartialToggleablePatchOptions) : ToggleablePatchOptions {
    return {
        label,
        defaultValue: defaultValue ?? false,
        requires: requires ?? (() => true)
    };
}

function toggleablePatches<T extends Record<string, PartialToggleablePatchOptions>>(options: T): {
    [key in keyof T]: ToggleablePatchOptions
} {
    return Object.fromEntries(
        Object.entries(options)
            .map(([k,v]) => [k, toggleablePatch(v)])
    ) as ReturnType<typeof toggleablePatches<T>>;
}


export interface RomFileOptions {
    label: string,
    defaultValue: NoFileDropzoneValue,
    expectedHash?: string
}

export type AppFormData = SelectablePatchesData & ToggleablePatchesData & RomFileData;

type SelectablePatchesData = {
    [key in keyof typeof SELECTABLE_PATCHES]: keyof typeof SELECTABLE_PATCHES[key]["options"]
};

type ToggleablePatchesData = {
    [key in keyof typeof TOGGLEABLE_PATCHES]: boolean
};

type RomFileData = {
    [key in keyof typeof ROM_FILE]: FileDropzoneValue | null
}

export const ROM_FILE = {
    romFile: {
        label: "Pokemon Emerald Rom",
        defaultValue: {
            type: FileDropzoneType.NO_FILE
        },
        expectedHash: "a9dec84dfe7f62ab2220bafaef7479da0929d066ece16a6885f6226db19085af"
    }
} satisfies Record<string, RomFileOptions>;

export const SELECTABLE_PATCHES = selectablePatches({
    base: {
        label:
            "Patch Base",
        options:
            {
                deluxe: "Deluxe",
                legacy: "Legacy"
            }
    },
    variant: {
        label:
            "Variant",
        options:
            {
                regular: "Regular",
                vanillaWilds:
                    "Vanilla Wilds",
                vanillaWildsPlus:
                    "Vanilla Wilds Plus"
            }
    },
    dns: {
        label:
            "Day Night System",
        options:
            {
                def: "Default",
                inBattle:
                    "DNS In-Battle",
                disable:
                    "Disable"
            }
    },
    egg: {
        label:
            "Free Egg Pokemon",
        options:
            {
                def: "Default",
                wynaut:
                    "Wynaut",
                tyrogue:
                    "Tyrogue"
            }
    },
    moveStats: {
        label:
            "Move Stats",
        options:
            {
                iv: "Gen IV",
                v:
                    "Gen V",
                vi:
                    "Gen VI"
            }
    }
});

export const TOGGLEABLE_PATCHES: {
    expShare: ToggleablePatchOptions;
    decap: ToggleablePatchOptions;
    moveFasterUnderwater: ToggleablePatchOptions;
    disableBikeMusic: ToggleablePatchOptions;
    loreFriendlyEvos: ToggleablePatchOptions;
    poisonUpdate: ToggleablePatchOptions;
    noFleeingPokemonInSafariZone: ToggleablePatchOptions;
    berriesNoLongerDisapear: ToggleablePatchOptions;
    modernStats: ToggleablePatchOptions;
    disableRandomPokenavCalls: ToggleablePatchOptions;
    autoNickName: ToggleablePatchOptions;
    noDarkCaves: ToggleablePatchOptions;
    prngFix: ToggleablePatchOptions;
    hiddenAbilities: ToggleablePatchOptions;
    gen4LiteMovesets: ToggleablePatchOptions
} = toggleablePatches({
    expShare: {
        label: "Gen VI Exp Share",
    },
    autoNickName: {
        label: "Auto Nickname Case",
    },
    hiddenAbilities: {
        label: "Hidden Abilities",
    },
    modernStats: {
        label: "Modern Stats"
    },
    berriesNoLongerDisappear: {
        label: "Berries No Longer Disappear"
    },
    noDarkCaves: {
        label: "No Dark Caves"
    },
    decap: {
        label: "Decapitalize Names",
        defaultValue: true
    },
    disableRandomPokenavCalls: {
        label: "Disable Random Pokenav Calls",
    },
    loreFriendlyEvos: {
        label: "Lore-Friendly Evolutions"
    },
    moveFasterUnderwater: {
        label: "Move Faster Underwater"
    },
    disableBikeMusic: {
        label: "Disable Bike Music"
    },
    poisonUpdate: {
        label: "Poison Update"
    },
    prngFix: {
        label: "PRNGFix"
    },
    noFleeingPokemonInSafariZone: {
        label: "No Fleeing Pokemon in Safari Zone"
    },
    gen4LiteMovesets: {
        label: "Gen IV Lite Movesets",
        requires: ((data) => data.base === 'legacy')
    }
});


export const DEFAULT_FORM_DATA : AppFormData = Object.fromEntries(
    [ROM_FILE,SELECTABLE_PATCHES,TOGGLEABLE_PATCHES]
        .map(x => Object.entries(x))
        .flat()
        .map(([k,v]) => [k,v.defaultValue])
) as AppFormData

