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
  {
    expansion: 'midnight',
    profession: 'blacksmithing',
    expansionLabel: 'Midnight',
    professionLabel: 'Blacksmithing',
    realm: 'Stormrage-US',
    description:
      "Every Midnight Blacksmithing recipe — skill requirement, how it's learned, exact materials, and cost vs. Auction House sale price per craft.",
    loadRecipes: () => import('./recipes/midnight-blacksmithing.js'),
    loadItemIds: () => import('./itemIds/midnight-blacksmithing.js'),
  },
  {
    expansion: 'midnight',
    profession: 'leatherworking',
    expansionLabel: 'Midnight',
    professionLabel: 'Leatherworking',
    realm: 'Stormrage-US',
    description:
      "Every Midnight Leatherworking recipe — skill requirement, how it's learned, exact materials, and cost vs. Auction House sale price per craft.",
    loadRecipes: () => import('./recipes/midnight-leatherworking.js'),
    loadItemIds: () => import('./itemIds/midnight-leatherworking.js'),
  },
  {
    expansion: 'classic',
    profession: 'blacksmithing',
    expansionLabel: 'Classic',
    professionLabel: 'Blacksmithing',
    realm: 'Stormrage-US',
    description:
      "1→300 leveling route for retail's Classic Blacksmithing skill tier (not a Classic Era server) — one recipe per bracket, exact materials, and live Auction House cost on Stormrage-US.",
    loadRecipes: () => import('./recipes/classic-blacksmithing.js'),
    loadItemIds: () => import('./itemIds/classic-blacksmithing.js'),
  },
]

export function findCombo(expansion, profession) {
  return WOW_REGISTRY.find(c => c.expansion === expansion && c.profession === profession)
}
