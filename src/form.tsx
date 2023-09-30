import {FileDropzoneType, FileDropzoneValue, NoFileDropzoneValue, RomFile} from "./components/FileDropzone.tsx";
import {ReactNode} from "react";

interface PartialSelectablePatchOptions {
    label: string,
    options: Record<string,string>,
    requires?: (data: AppFormData) => boolean,
    defaultValue?: string,
    info?: ReactNode,
    priority?: number,
}

export interface SelectablePatchOptions {
    label: string,
    options: Record<string,string>,
    requires: (data: AppFormData) => boolean,
    defaultValue: string,
    info?: ReactNode,
    priority: number,
}


function selectablePatch({
                                                               defaultValue,
                                                               label,
                                                               options,
                                                               requires,
                                                               info,
                                                               priority
                                                           }: PartialSelectablePatchOptions): SelectablePatchOptions {
    return {
        label,
        options,
        requires: requires ?? (() => true),
        defaultValue: defaultValue ?? Object.keys(options)[0],
        info,
        priority: priority ?? 0,
    };
}

function selectablePatches(options: Record<string, PartialSelectablePatchOptions>) {
    return Object.fromEntries(Object.entries(options)
        .map(([k, v]) => [k, selectablePatch(v)])) as Record<string, SelectablePatchOptions>
}


interface PartialToggleablePatchOptions {
    label: string,
    defaultValue?: boolean,
    requires?: (data: AppFormData) => boolean,
    info?: ReactNode,
    priority?: number,
}


interface ToggleablePatchOptions {
    label: string,
    defaultValue: boolean,
    requires: (data: AppFormData) => boolean,
    info?: ReactNode,
    priority: number,
}

function toggleablePatch({
                             defaultValue, label, requires, info, priority,
                         }: PartialToggleablePatchOptions): ToggleablePatchOptions {
    return {
        label,
        defaultValue: defaultValue ?? false,
        requires: requires ?? (() => true),
        info: info,
        priority: priority ?? 0,
    };
}

function toggleablePatches(options: Record<string,PartialToggleablePatchOptions>): Record<string,ToggleablePatchOptions> {
    return Object.fromEntries(Object.entries(options)
        .map(([k, v]) => [k, toggleablePatch(v)]));
}


export interface RomFileOptions {
    label: string,
    defaultValue: NoFileDropzoneValue,
    expectedHash?: string
}

export type AppFormData = Record<string, string | boolean | FileDropzoneValue | null>;


export const ROM_FILE = {
    romFile: {
        label: "Pokemon Emerald Rom", defaultValue: {
            type: FileDropzoneType.NO_FILE
        }, expectedHash: "a9dec84dfe7f62ab2220bafaef7479da0929d066ece16a6885f6226db19085af"
    }
} satisfies Record<string, RomFileOptions>;



export const SELECTABLE_PATCHES = selectablePatches({
    base: {
        label: "Patch Base",
        options: {
            deluxe: "Deluxe",
            legacy: "Legacy"
        },
        priority: 2,
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
    }, variant: {
        label: "Variant",
        options: {
            newWilds: "New Wilds",
            vanillaWilds: "Vanilla Wilds",
            vanillaWildsPlus: "Vanilla Wilds Plus"
        },
        priority: 1,
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
    }, dns: {
        label: "Day Night System", options: {
            def: "Default", inBattle: "DNS In-Battle", disable: "Disable"
        }, info: (<>
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
        </>)
    }, egg: {
        label: "Free Egg Pokemon", options: {
            def: "Default", wynaut: "Wynaut", tyrogue: "Tyrogue"
        }, info: (<>
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
        </>)
    }, moveStats: {
        label: "Move Stats", options: {
            def: "Default", iv: "Gen IV", v: "Gen V", vi: "Gen VI"
        }, info: (<p>
            The Move Stats options change the Accuracy, Power, and PP of moves to different generations' settings.
            Each option's list of Move Stats are in the Documentation folder.
        </p>)
    }, sprites: {
        label: "Sprites", options: {
            def: "Default", geniv: "Gen IV", moemon: "Moemon"
        }, info: (<>
            <p>
                These make the pokemon have different appearances. The Gen4 Style Sprite Replacement makes the
                pokemon look like they do in Gen 4. The Moemon Sprite Replacement makes the pokemon look like anime
                characters. Big thanks to the Moémon Project for making those sprites! Their Discord is:
                https://discord.gg/Ds7bjJMumn
            </p>
            <p>
                Also thanks to Axcellerator#5035 on Discord for assembling these for me &lt;3
            </p>
        </>), priority: -1
    }
});

export const TOGGLEABLE_PATCHES= toggleablePatches({
    expShare: {
        label: "Gen VI Exp Share", info: (<>
            <p>
                The Gen VI Exp Share makes the regular Exp Share give experience to your entire party.
            </p>
            <p>
                <strong>NOTE:</strong> You need to have the item in your bag *not* held by a Pokemon!
            </p>
        </>)
    }, autoNickName: {
        label: "Auto Nickname Case", info: (<p>
            The Auto Nickname Case option makes it so when you go to Nickname a Pokemon, after inputting the first
            letter, it automatically switches to Lowercase.
        </p>)
    }, hiddenAbilities: {
        label: "Hidden Abilities",
        info: (<>
            <p>
                The Hidden Abilities option adds in secondary abilities to Pokemon that only have one in vanilla but
                gained a Hidden Ability in later gens that existed in Gen 3.
            </p>
            <p>
                Example: Caterpie in vanilla ONLY has the Shield Dust ability, but in later gens it has Run Away as
                a Hidden Ability, so if you add the Hidden Abilities option, Caterpie will have Shield Dust and Run
                Away. BUT Butterfree will not have Tinted Lens since even though it has that as a Hidden Ability in
                later gens, it is an ability that does not exist in Gen 3.
            </p>
            <p>
                vanilla and changed abilities are listed in the Documentation Folder.
            </p>
        </>),
    }, modernStats: {
        label: "Modern Stats",
        info: (<>
            <p>
                The Modern Stats option updates the Base Stats for Pokemon who have had them changed in later gens.
            </p>
            <p>
                Example: in Gen VI, Pikachu had both its Defense and Special Defense increased by 10.
            </p>
            <p>
                The list of changed base stats is listed in the Documentation Folder
            </p>
        </>),
    }, berriesNoLongerDisappear: {
        label: "Berries No Longer Disappear", info: (<p>
            The Berries No Longer Disappear option makes planted Berries regrow indefinitely. In vanilla, they can
            only regrow so many times before disappearing.
        </p>)
    }, noDarkCaves: {
        label: "No Dark Caves", info: (<p>
            This patch makes the two caves that normally are dark and require Flash (Granite Cave and Victory Road)
            have normal light levels. This does NOT affect the Dewford Gym, Battle Pyramid, or the third Trick House
            Puzzle.
        </p>)
    }, decap: {
        label: "Recapitalize Names", info: (<>
            <p>
                By default, Emerald Final has the unnecessary FULLY CAPITALIZED proper nouns put into the Proper
                Case, however some miss the look of that so this patch restores it.
            </p>
            <p>
                Note: The additional text I have added will not be re-capitalized.
            </p>
        </>)
    }, disableRandomPokenavCalls: {
        label: "Disable Random Pokenav Calls", info: (<p>
            The Disable Pokenav Calls option makes the random calls you get from other trainers no longer happen.
        </p>)
    }, loreFriendlyEvos: {
        label: "Lore-Friendly Evolutions", info: (<>
            <p>
                The Lore-Friendly Evos option makes the trade evolutions more in line with the vanilla method. This
                usually means levelup while holding the same item meant to be held while trading.
            </p>
            <p>
                The evolutions are listed in the Documentation Folder.
            </p>
        </>)
    }, moveFasterUnderwater: {
        label: "Move Faster Underwater", info: (<p>
            This is exactly what it sounds like. You'll move faster when underwater. But if you're actually reading
            this, I sincerely thank you for taking the time to read the documentation!
        </p>)
    }, disableBikeMusic: {
        label: "Disable Bike Music", info: (<p>
            This is exactly what it sounds like. You won't hear different music when mounting a Bike. But if you're
            actually reading this, I sincerely thank you for taking the time to read the documentation!
        </p>)
    }, poisonUpdate: {
        label: "Poison Update", info: (<>
            <p>
                The Poison Update makes the poison damage your Pokemon take outside of battle every four steps stop
                at 1 HP, and fades away.
            </p>
        </>)
    }, prngFix: {
        label: "PRNGFix", info: (<>
            <p>
                The PRNG Fix makes changes to the in-game random chances (moves missing, which encounter on a route
                is trigged, etc) that make it work as intended. For those who don't know, Pokemon Emerald's Psuedo
                Random Number Generator (PRNG) is broken. Because of this, people can manipulate their actions to
                produce a desired result, such as wating for the precise moment to throw a pokeball to catch a
                pokemon at full health, or getting a pokemon with perfect IVs.
            </p>
            <p>
                The casual player probably won't notice something like that, but a few people have requested this
                feature so I have added it as an option.
            </p>
            <p>
                Side note: The reason why it's called a PSUEDO Random Number Generator is because computers aren't
                able to do purely random things, so the way it is accomplished is by making an algorithm that
                outputs seemingly unrelated numbers based on a start point (called a SEED) determined when you open
                the game/turn on the device. This means that if you knew the exact algorithm and the seed, you would
                have access to all the "random" results, and cheat accordingly. The reason Emerald's PRNG is broken
                is because it does not "re-seed", every time you start the game, it uses the exact same seed so it
                is able to be predicted and therefore abused. Those who have played games like Minecraft where you
                can choose your own seed can relate to this; if you use the same seed, you get the same world and
                can plan an optimal route, where rare resources spawn and such.
            </p>
        </>)
    }, noFleeingPokemonInSafariZone: {
        label: "No Fleeing Pokemon in Safari Zone", info: (<p>
            This is exactly what it sounds like. Pokemon in the Safari Zone won't flee. But if you're actually
            reading this, I sincerely thank you for taking the time to read the documentation!
        </p>)
    }, gen4LiteMovesets: {
        label: "Gen IV Lite Movesets", requires: ((data) => data.base === 'legacy'), info: (<>
            <p>
                The Gen4-lite Movesets gives every Pokemon its levelup set from the Gen 4 games, minus the moves
                that didn't exist in Gen 3.
            </p>
            <p>
                The main appeal of this is the additional coverage given to many Pokemon, for example, Psyduck does
                not get a single attacking water move until level 50 in Emerald. With the Gen4-lite Movesets,
                Psyduck gets Water Gun at level 9.
            </p>
        </>)
    }
});
export type Patch = SelectablePatchOptions | ToggleablePatchOptions;

export const DEFAULT_FORM_DATA: AppFormData = Object.fromEntries([ROM_FILE, SELECTABLE_PATCHES, TOGGLEABLE_PATCHES]
    .map(x => Object.entries(x))
    .flat()
    .map(([k, v]) => [k, v.defaultValue])) as AppFormData

