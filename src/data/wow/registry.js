// Central list of available WoW profession trackers — one entry per
// expansion+profession combo. WowHub.jsx renders these as cards;
// ProfessionTracker.jsx resolves the :expansion/:profession route params
// against this list and dynamic-imports the matching data modules so a
// visit to one tracker doesn't pull every profession's data into the bundle.
//
// To add a combo: research it per docs/wow-tracker-playbook.md, drop the
// resulting data files in ./recipes and ./itemIds following the existing
// midnight-jewelcrafting.js shape (RECIPES, LEARN_METHODS,
// getAllMaterialKeys, getAllSellables, getCategories / WOW_ITEM_IDS), and
// add one entry here.

export const WOW_REGISTRY = [
  {
    expansion: 'midnight',
    profession: 'jewelcrafting',
    expansionLabel: 'Midnight',
    professionLabel: 'Jewelcrafting',
    realm: 'Stormrage-US',
    description:
      "Every Midnight Jewelcrafting recipe — skill requirement, how it's learned, exact materials, and cost vs. Auction House sale price per craft.",
    loadRecipes: () => import('./recipes/midnight-jewelcrafting.js'),
    loadItemIds: () => import('./itemIds/midnight-jewelcrafting.js'),
  },
]

export function findCombo(expansion, profession) {
  return WOW_REGISTRY.find(c => c.expansion === expansion && c.profession === profession)
}
