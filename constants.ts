import { Category, BreedDetails } from './types';

export const FALLBACK_TREE_EN: Category[] = [
  {
    id: 'region-western',
    name: 'Western Breeds',
    type: 'category',
    children: [
      {
        id: 'coat-shorthair-w',
        name: 'Shorthair',
        type: 'subcategory',
        children: [
          { id: 'american-shorthair', name: 'American Shorthair', type: 'breed' },
          { id: 'british-shorthair', name: 'British Shorthair', type: 'breed' }
        ]
      },
      {
        id: 'coat-longhair-w',
        name: 'Longhair',
        type: 'subcategory',
        children: [
          { id: 'maine-coon', name: 'Maine Coon', type: 'breed' },
          { id: 'ragdoll', name: 'Ragdoll', type: 'breed' }
        ]
      }
    ]
  },
  {
    id: 'region-eastern',
    name: 'Eastern Breeds',
    type: 'category',
    children: [
      {
        id: 'coat-shorthair-e',
        name: 'Shorthair',
        type: 'subcategory',
        children: [
          { id: 'siamese', name: 'Siamese', type: 'breed' },
          { id: 'bengal', name: 'Bengal', type: 'breed' }
        ]
      }
    ]
  }
];

export const FALLBACK_TREE_ZH: Category[] = [
  {
    id: 'region-western',
    name: '西方品种',
    type: 'category',
    children: [
      {
        id: 'coat-shorthair-w',
        name: '短毛',
        type: 'subcategory',
        children: [
          { id: 'american-shorthair', name: '美国短毛猫', type: 'breed' },
          { id: 'british-shorthair', name: '英国短毛猫', type: 'breed' }
        ]
      },
      {
        id: 'coat-longhair-w',
        name: '长毛',
        type: 'subcategory',
        children: [
          { id: 'maine-coon', name: '缅因猫', type: 'breed' },
          { id: 'ragdoll', name: '布偶猫', type: 'breed' }
        ]
      }
    ]
  },
  {
    id: 'region-eastern',
    name: '东方品种',
    type: 'category',
    children: [
      {
        id: 'coat-shorthair-e',
        name: '短毛',
        type: 'subcategory',
        children: [
          { id: 'siamese', name: '暹罗猫', type: 'breed' },
          { id: 'bengal', name: '孟加拉豹猫', type: 'breed' }
        ]
      }
    ]
  }
];

export const INITIAL_BREED_DETAILS_EN: BreedDetails = {
  name: "Welcome to Purrfect World",
  description: "Select a breed from the menu to explore its unique characteristics! Our cute AI catalog is ready to help you find your perfect furry friend.",
  origin: "Cat Planet",
  lifeSpan: "Forever in heart",
  weight: "Just right",
  temperament: ["Cute", "Fluffy", "Sweet"],
  stats: {
    friendliness: 100,
    energy: 100,
    grooming: 50,
    intelligence: 100,
    vocalisation: 50
  },
  funFact: "Cats are essentially liquid and can fit into any box they want!"
};

export const INITIAL_BREED_DETAILS_ZH: BreedDetails = {
  name: "欢迎来到喵星世界",
  description: "请从左侧菜单选择一个品种来探索它的独特魅力！我们可爱的AI图鉴已经准备好为您介绍这些毛茸茸的朋友了。",
  origin: "喵星球",
  lifeSpan: "永远在心里",
  weight: "刚刚好",
  temperament: ["可爱", "毛茸茸", "甜美"],
  stats: {
    friendliness: 100,
    energy: 100,
    grooming: 50,
    intelligence: 100,
    vocalisation: 50
  },
  funFact: "猫咪本质上是液体，可以装进任何盒子里！"
};