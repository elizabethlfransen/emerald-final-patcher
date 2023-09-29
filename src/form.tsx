import {FileDropzoneType, FileDropzoneValue, NoFileDropzoneValue} from "./components/FileDropzone.tsx";
import {ReactNode} from "react";

interface PartialSelectablePatchOptions<T extends Record<string, string>> {
    label: string,
    options: T,
    requires?: (data: AppFormData) => boolean,
    defaultValue?: keyof T,
    info?: ReactNode
}

export interface SelectablePatchOptions<T extends Record<string, string>> {
    label: string,
    options: T,
    requires: (data: AppFormData) => boolean,
    defaultValue: keyof T,
    info?: ReactNode
}


function selectablePatch<T extends Record<string, string>>({
                                                               defaultValue,
                                                               label,
                                                               options,
                                                               requires,
                                                               info
                                                           }: PartialSelectablePatchOptions<T>): SelectablePatchOptions<T> {
    return {
        label,
        options,
        requires: requires ?? (() => true),
        defaultValue: defaultValue ?? Object.keys(options)[0],
        info
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

function toggleablePatch({defaultValue, label, requires}: PartialToggleablePatchOptions): ToggleablePatchOptions {
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
            .map(([k, v]) => [k, toggleablePatch(v)])
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
            },
        info: (
            <>
                <p>
                    Deluxe uses the Battle Engine Upgrade v1 by DizzyEgg, which I have used to add in modern mechanics
                    and 4th gen evolutions, abilities, and moves. There are a few visual bugs but nothing gamebreaking.
                    Also the recharge moves like Hyper Beam had to be changed to recoil because they wouldn't function
                    properly.
                </p>
                <p>
                    Legacy has all the features minus Gen 4 additions.
                </p>
            </>
        )
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
            },
        info: (
            <>
                <p>
                    Vanilla wilds... Has the Vanilla Wilds
                </p>
                <p>
                    Vanilla Wilds Plus includes version exclusives from Ruby/Sapphire.
                </p>
                <p>
                    New Wilds has all 386 pokemon available.
                </p>
            </>
        )
    },
    dns: {
        label: "Day Night System",
        options: {
            def: "Default",
            inBattle:
                "DNS In-Battle",
            disable:
                "Disable"
        },
        info: (
            <>
                <p>The Day-Night System (DNS) goes by the <em><strong>system</strong></em> time to show a color filter
                    outside to make it feel
                    like it is actually nighttime in the game. This does not alter the encounters like in Gen 2.</p>
                <p>
                    By default, this only applies when outside and not in battle. But by adding the <strong>Add DNS In
                    Battle</strong> option, this will also apply in battles.
                </p>
                <p>
                    By adding the <strong>Remove DNS</strong> option, the DNS will be removed... Pretty self-explanatory
                    :)
                </p>
            </>
        )
    },
    egg: {
        label: "Free Egg Pokemon",
        options: {
            def: "Default",
            wynaut: "Wynaut",
            tyrogue: "Tyrogue"
        },
        info: (
            <>
                <p>
                    By default, the egg contains a Togepi (Vanilla is Wynaut).
                </p>
                <p>
                    If you wish for the egg to contain a Tyrogue or Wynaut, simple apply the appropriate patch before
                    talking to the NPC who gives the egg.
                </p>
                <p>
                    Togepi because it is only obtainable post game otherwise, Tyrogue so you can get a good Fighting
                    type before the Normal gym.
                </p>
            </>
        )
    },
    moveStats: {
        label: "Move Stats",
        options: {
            iv: "Gen IV",
            v: "Gen V",
            vi: "Gen VI"
        },
        info: (
            <p>
                The Move Stats options change the Accuracy, Power, and PP of moves to different generations' settings.
                Each option's list of Move Stats are in the Documentation folder.
            </p>
        )
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


export const DEFAULT_FORM_DATA: AppFormData = Object.fromEntries(
    [ROM_FILE, SELECTABLE_PATCHES, TOGGLEABLE_PATCHES]
        .map(x => Object.entries(x))
        .flat()
        .map(([k, v]) => [k, v.defaultValue])
) as AppFormData

