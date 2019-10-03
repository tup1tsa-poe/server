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
  export interface ItemType {
    accessories?: [string];
    armour?: [string];
    weapons?: [string];
    jewels?: [string];
  }

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
    relic
  }

  export enum ItemPropertyValueType {
    /** physical value */
    "white" = 0,
    /** blue is used for modified values. Whatever that means */
    "blue" = 1,
    /** where are 2 and 3? */
    "fire" = 4,
    "cold" = 5,
    "lightning" = 6,
    "chaos" = 7
  }

  /** can be either property or requirement */
  export interface ItemProperty {
    /** for example: 'aura, spell, aoe', 'cast time' */
    name: string;
    /** number is value, and then type (it's number too) */
    values: [number, ItemPropertyValueType];
    /** wtf? */
    displayMode: number;
    /** no clue. */
    type?: number;
    /** experience for gems? */
    progress?: number;
  }

  export interface Socket {
    /** number for linked group. Used for calculation of item's links */
    group: number;
    /** Socket color: Green, White, Red, Blue, Abyss (though it's not a color but type) */
    sColour: "G" | "W" | "R" | "B" | "A";
    /** attribute of socket. Stands for strength, dex, int, general and false for abyss */
    attr: "S" | "D" | "I" | "G" | false;
  }

  // todo: check item interface. Some properties can be optional or some aren't stated atm. Check with array.every
  export interface Item {
    /** optional flag for new jewels */
    abyssJewel?: boolean;
    /** no clue. Check it later */
    additionalProperties?: ItemProperty[];
    /** something about divination cards */
    artFilename?: string;
    /**  can be 'maps' or { 'accessories': ['ring'] } */
    category: string | ItemType;
    corrupted?: boolean;
    cosmeticMods?: string[];
    /** user crafted mods via masters */
    craftedMods?: string[];
    /** main description */
    descrText?: string;
    /** item is duplicated via mirror or randomly from chest */
    duplicated?: boolean;
    /** is item elder */
    elder?: boolean;
    /** labyrinth enchantments */
    enchantMods?: string[];
    /** mods 'under' the line */
    explicitMods?: string[];
    /** ? */
    flavourText?: string[];
    /** item rarity.  */
    frameType: ItemRarity;
    /** slot height */
    h: number;
    /** url for icon image */
    icon: string;
    /** unique item id which wouldn't change after using currency on the item */
    id: string;
    identified: boolean;
    /** item level */
    ilvl: number;
    /** mods 'above' the line */
    implicitMods?: string[];
    /** 'Stash25' or 'Stash3' */
    inventoryId: string;
    isRelic?: boolean;
    /** standard, hardcore, abyss etc */
    league: string;
    /** wtf? */
    lockedToCharacter?: boolean;
    /** stack size. Mostly irrelevant */
    maxStackSize?: number;
    /** either regular name for a unique item or weird like '<<set:MS>><<set:M>><<set:S>>Armageddon Skewer' */
    // also name can be empty string ''
    name: string;
    nextLevelRequirements?: ItemProperty[];
    /** can be price or regular note. */
    note?: string;
    /** specify armour, evasion,etc */
    properties?: ItemProperty[];
    prophecyDiffText?: string;
    prophecyText?: string;
    /** level, dex, str etc */
    requirements?: ItemProperty[];
    /** mostly irrelevant second description */
    secDescrText?: string;
    /** is item dropped in shaper map */
    shaper: boolean;
    /** irrelevant gems inside sockets. It's like recursion, because gem is an item too in general */
    socketedItems?: object[];
    sockets?: Socket[];
    stackSize?: number;
    /** gem support? */
    support?: boolean;
    talismanTier?: number;
    /** item base type, mixed with affix name for magic/rare items */
    typeLine: string;
    /** mods for flasks */
    utilityMods?: string[];
    /** wtf? How an item can be verified? By whom? */
    verified: boolean;
    /** slow width */
    w: number;
    /** horizontal item position in the stash */
    x: number;
    /** vertical item position in the stash */
    y: number;
  }

  export interface Stash {
    id: string;
    items: Item[];
    public: boolean;
    /** stashType can be: 'Premium stash', 'Map stash', etc */
    stashType: string;
  }

  export interface FullStash extends Stash {
    accountName: string;
    lastCharacterName: string;
    /** name of stash defined by user */
    stash: string;
  }

  export interface EmptyStash extends Stash {
    accountName: null;
    lastCharacterName: null;
    stash: null;
  }

  export interface GeneralResponse {
    next_change_id: string;
    stashes: (EmptyStash | FullStash)[];
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
    officialApiItem: OfficialApi.Item;
    modifiers: Modifiers.Modifier[];
  }
}
