import { Database } from "./Database";
import { Modifiers, OfficialApi } from "../types";

import Modifier = Modifiers.Modifier;
import ModifiersSearchOptions = Modifiers.ModifiersSearchOptions;
import Stash = OfficialApi.Stash;

// todo: implement next
// 1) when parsing all stashes, find all possible unique modifiers
// ...() (all implicit, explicit, crafted, enchanted, utils)
// 2) having this big list of modifiers, add them to modifiers collection via the
// ... regular write method of database (but one should be careful to check if it doesn't throw an
// ... error if the first modifier is already set in the collection). It should add only those which are not yet set.
// 3) While creating list of all modifiers, one should create different groups of items on which those modifiers
// ... are applied. For example, 'helmet': ['mod 1, 'mod 2'], 'boots': ['mod 1 for boots', 'next mod']
// 4) For every item type (helmet, boots, etc) run next update query (this one is for helmet)
// ...db.getCollection('modifiers').updateMany(
// {used_in: { $all: ["helmet"] }},
// {$addToSet: {used_in: {$each: ["helmet"]}}})
// 5) While creating list of modifiers treat unique items differently (their modifiers can be very 'unique')
// ... for every unique item create structure item copy, which should include item_name, item_type (helmet, etc),
// ..., modifiers links (to all modifiers objects _id), mb something else

// to find all modifiers for type (for example, 'helmet') use regular read method from database with next params
// queryObj = { used_in: { $all: ["helmet"] } }. Sorted object doesn't matter. Limit undefined
// searching modifiers for a unique should be different (find unique object by its name and then find modifiers ...
// ... by theit unique internal  _id, which should be stored in unique item object)

export class ModifiersDatabase extends Database {
  constructor() {
    super("modifiers");
  }

  public async writeModifiers(modifiers: Modifier[]) {
    await this.write(modifiers, { ordered: false });
    const result = this.getResult();
    if (result.error) {
      // check the error (it can either be duplicate insert  or some other error)
      throw new Error("There were some problems saving modifiers");
    }
  }

  public async tempUpdate(stashes: Stash[], changeId: string) {
    for (const stash of stashes) {
      let abyss = 0;
      let other = 0;
      stash.items.forEach(item => {
        if (item.league === "Abyss") {
          abyss++;
        } else {
          other++;
        }
      });
      try {
        await this.upsert(
          {
            _id: stash.id
          },
          {
            _id: stash.id,
            abyss,
            other
          }
        );
      } catch (err) {
        debugger;
      }
    }
    return await this.upsert(
      { latest_id: { $exists: true } },
      { latest_id: changeId }
    );
  }

  public async fetchAllModifiers(): Promise<object[]> {
    return await this.fetchModifiers({}, { name: 1 });
  }

  public async fetchModifiers(
    modifiersData: ModifiersSearchOptions = {},
    sortObject: object = { name: 1 },
    limit: number = 0
  ): Promise<object[]> {
    const query = Object.create(null);
    if (modifiersData.names) {
      query.name = { $in: modifiersData.names };
    }
    if (modifiersData.types) {
      query.type = { $in: modifiersData.types };
    }
    if (modifiersData.used_in) {
      query.used_in = { $in: modifiersData.used_in };
    }
    await this.read(query, sortObject, limit);
    const result = this.getResult();
    if (result.error || !result.data) {
      throw new Error(`cannot find modifiers`);
    }
    return result.data;
  }
}
