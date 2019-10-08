import * as express from "express";
import { RequestResponse } from "request";

export namespace Server {
  export interface CurrencyRequest extends express.RequestParamHandler {
    body: {
      from: Currency.Quantity;
      to: string;
    };
  }

  export interface AddFilterRequest extends express.RequestParamHandler {
    body: {
      filter: Filters.Filter;
    };
  }

  export interface ServerResponse extends express.Response {}
}

export namespace Currency {
  export interface Quantity {
    value: number;
    name: string;
  }

  export interface ChaosEquivalent {
    name: string;
    value: number | undefined;
  }

  export interface DatabaseList {
    updateTime: number;
    exchangeRates: ChaosEquivalent[];
  }

  export interface Shorthand {
    name: string;
    shorthands: string[];
  }
}

export namespace Filters {
  export interface FilterParameter {
    name: string;
    min: number;
    max: number;
  }

  export interface Filter {
    name: string;
    body: FilterParameter[];
  }
}

export namespace PoeNinjaInterface {
  export interface PayReceive {
    count: number;
    dataPointCount: number;
    getCurrencyId: number;
    id: number;
    includes_secondary: boolean;
    leagueId: number;
    payCurrencyId: number;
    sampleTimeUtc: string;
    value: number;
  }

  export interface CurrencyDetails {
    id: number;
    icon: string;
    name: string;
    poeTradeId: number;
  }

  export interface Lines {
    chaosEquivalent: number;
    currencyTypeName: string;
    pay: PayReceive;
    receive: PayReceive;
    paySparkLine: object[];
    receiveSparkLine: object[];
  }

  export interface Api {
    currencyDetails: CurrencyDetails[];
    lines: Lines[];
  }
}

export namespace OfficialApi {
  /** For some stupid reason it can be either item rarity or item type */
  export enum ItemRarity {
    normal = 0,
    magic,
    rare,
    unique,
    gem,
    "currency",
    "divination card",
    "quest item",
    prophecy,
    relic,
    // what type is that? check it out
    unknown
  }

  /** can be either property or requirement */
  export interface ItemProperty {
    /** for example: 'aura, spell, aoe', 'cast time' */
    readonly name: string;
    readonly values: [string, number];
    /** wtf? */
    readonly displayMode: number;
    /** no clue. */
    readonly type?: number;
    /** experience for gems? */
    readonly progress?: number;
  }

  export interface Socket {
    /** number for linked group. Used for calculation of item's links */
    group: number;
    /** Socket color: Green, White, Red, Blue, Abyss, Delve */
    sColour: "G" | "W" | "R" | "B" | "A" | "DV";
    /** attribute of socket. Stands for strength, dex, int, general, abyss, delve */
    attr: "S" | "D" | "I" | "G" | "A" | "DV";
  }

  export interface ItemShallow {
    // item shallow is used when item shape in the stash resembles valid item
    // only item identifying properties are checked
    // it may be invalid (not up to date with the current app)
    // if the item is not valid (wasn't parsed by the app, because new prop was added by the devs)
    // full item body should be saved into db for further investigations
    readonly id: string;
    readonly inventoryId: string;
    readonly league: string;
  }

  export interface ItemShallowWithBody extends ItemShallow {
    readonly itemJson: string;
  }

  interface IncubatedItem {
    readonly level: number;
    readonly name: string;
    readonly progress: number;
    readonly total: number;
  }

  interface HybridItem {
    readonly isVaalGem?: boolean;
    readonly baseTypeName: string;
    readonly explicitMods: ReadonlyArray<string>;
    readonly properties: ReadonlyArray<ItemProperty>;
    readonly secDescrText: string;
  }

  type MainCategory =
    | "maps"
    | "accessories"
    | "armour"
    | "jewels"
    | "weapons"
    | "gems"
    | "flasks"
    | "currency"
    | "cards"
    | "monsters";
  interface ExtendedProperties {
    readonly category: MainCategory;
    readonly subcategories?: ReadonlyArray<string>;
    readonly prefixes?: number;
    readonly suffixes?: number;
  }

  export interface ItemFull {
    /** optional flag for new jewels */
    readonly abyssJewel?: boolean;
    /** no clue. Check it later */
    readonly additionalProperties?: ReadonlyArray<ItemProperty>;
    /** something about divination cards */
    readonly artFilename?: string;
    readonly corrupted?: boolean;
    readonly cosmeticMods?: ReadonlyArray<string>;
    /** user crafted mods via masters */
    readonly craftedMods?: ReadonlyArray<string>;
    readonly delve?: boolean;
    /** main description */
    readonly descrText?: string;
    /** item is duplicated via mirror or randomly from chest */
    readonly duplicated?: boolean;
    /** is item elder */
    readonly elder?: boolean;
    /** labyrinth enchantments */
    readonly enchantMods?: ReadonlyArray<string>;
    /** mods 'under' the line */
    readonly explicitMods?: ReadonlyArray<string>;
    readonly extended?: ExtendedProperties;
    /** ? */
    readonly flavourText?: ReadonlyArray<string>;
    /** item rarity.  */
    readonly frameType: ItemRarity;
    /** slot height */
    readonly h: number;
    // what is it?
    readonly hybrid?: HybridItem;
    /** url for icon image */
    readonly icon: string;
    /** unique item id which wouldn't change after using currency on the item */
    readonly id: string;
    readonly identified: boolean;
    /** item level */
    readonly ilvl: number;
    /** mods 'above' the line */
    readonly implicitMods?: ReadonlyArray<string>;
    readonly incubatedItem?: IncubatedItem;
    /** 'Stash25' or 'Stash3' */
    readonly inventoryId: string;
    readonly isRelic?: boolean;
    /** standard, hardcore, abyss etc */
    readonly league: string;
    // this property may not exist at all
    readonly lockedToCharacter?: boolean;
    /** stack size. Mostly irrelevant */
    readonly maxStackSize?: number;
    /** either regular name for a unique item or weird like '<<set:MS>><<set:M>><<set:S>>Armageddon Skewer' */
    // also name can be empty string ''
    readonly name: string;
    readonly nextLevelRequirements?: ReadonlyArray<ItemProperty>;
    /** can be price or regular note. */
    readonly note?: string;
    /** specify armour, evasion,etc */
    readonly properties?: ReadonlyArray<ItemProperty>;
    // may not exist
    readonly prophecyDiffText?: string;
    readonly prophecyText?: string;
    /** level, dex, str etc */
    readonly requirements?: ReadonlyArray<ItemProperty>;
    /** mostly irrelevant second description */
    readonly secDescrText?: string;
    /** is item dropped in shaper map */
    readonly shaper?: boolean;
    /** irrelevant gems inside sockets. It's like recursion, because gem is an item too in general */
    readonly socketedItems?: object[];
    readonly sockets?: ReadonlyArray<Socket>;
    readonly stackSize?: number;
    /** gem support? */
    readonly support?: boolean;
    readonly synthesised?: boolean;
    readonly talismanTier?: number;
    /** item base type, mixed with affix name for magic/rare items */
    readonly typeLine?: string;
    /** mods for flasks */
    readonly utilityMods?: ReadonlyArray<string>;
    readonly veiled?: boolean;
    readonly veiledMods?: ReadonlyArray<string>;
    /** wtf? How an item can be verified? By whom? */
    readonly verified: boolean;
    /** slow width */
    readonly w: number;
    /** horizontal item position in the stash */
    readonly x: number;
    /** vertical item position in the stash */
    readonly y: number;
  }

  export type Item = ItemFull | ItemShallow;
  export interface Stash {
    readonly id: string;
    readonly items: ReadonlyArray<ItemShallow>;
    readonly public: boolean;
    readonly lastCharacterName: string | null;
    /** name of stash defined by user */
    readonly stash: string | null;
    /** stashType can be: 'Premium stash', 'Map stash', etc */
    readonly stashType: string;
    readonly accountName: string | null;
    readonly league: string | null;
  }

  export interface GeneralResponse {
    readonly next_change_id: string;
    readonly stashes: ReadonlyArray<Stash>;
  }
}

export namespace RequestInterface {
  export interface Response {
    response: RequestResponse;
    success: boolean;
    error?: Error;
    body: string;
  }
}

export namespace Modifiers {
  export enum ModifierType {
    explicitMods = 0,
    implicitMods,
    craftedMods,
    utilityMods,
    enchantMods,
    cosmeticMods
  }

  export interface ModifierValue {
    values: number[] | null;
    average: number | null;
  }

  export interface Modifier {
    name: string;
    value: ModifierValue;
    type: ModifierType;
  }
}

export namespace InternalApi {
  export interface Item {
    officialApiItem: OfficialApi.ItemFull;
    modifiers: Modifiers.Modifier[];
  }
}
