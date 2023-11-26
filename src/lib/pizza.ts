interface Crusts {
  [key: string]: {
    name: string
    sizes: {
      [key: string]: {code: string; name: string}
    }
  }
}

export const crusts: Crusts = {
  HANDTOSS: {
    name: 'Hand Tossed ',
    sizes: {
      sm: {
        name: 'Small 10"',
        code: '10SCREEN',
      },
      md: {
        name: 'Medium 12"',
        code: '12SCREEN',
      },
      lg: {
        name: 'Large 14"',
        code: '14SCREEN',
      },
    },
  },
  NPAN: {
    name: 'Handmade Pan',
    sizes: {
      md: {
        name: 'Medium 12"',
        code: 'P12IPAZA',
      },
    },
  },
  THIN: {
    name: 'Crunchy Thin Crust',
    sizes: {
      md: {
        name: 'Medium 12"',
        code: '12THIN',
      },
      lg: {
        name: 'Large 14"',
        code: '14THIN',
      },
    },
  },
  BK: {
    name: 'Brooklyn Style',
    sizes: {
      lg: {
        name: 'Large 14"',
        code: 'PBKIREZA',
      },
      xl: {
        name: 'X-Large 16"',
        code: 'P16IBKZA',
      },
    },
  },
  GLUTENF: {
    name: 'Gluten Free',
    sizes: {
      sm: {
        name: 'Small 10"',
        code: 'P10IGFZA',
      },
    },
  },
}

export const sauces = [
  {
    code: 'X',
    name: 'Robust Inspired Tomato Sauce',
  },
  {
    code: 'Xm',

    name: 'Hearty Marinara Sauce',
  },
  {
    code: 'Bq',

    name: 'Honey BBQ Sauce',
  },
  {
    code: 'Xw',

    name: 'Garlic Parmesan Sauce',
  },
]

export const toppings = [
  {
    availability: [],
    code: 'C',
    description: '',
    local: false,
    name: 'Cheese',
    tags: {
      cheese: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'H',
    description: '',
    local: false,
    name: 'Ham',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'B',
    description: '',
    local: false,
    name: 'Beef',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Sa',
    description: '',
    local: false,
    name: 'Salami',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'P',
    description: '',
    local: false,
    name: 'Pepperoni',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'S',
    description: '',
    local: false,
    name: 'Italian Sausage',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Du',
    description: '',
    local: false,
    name: 'Premium Chicken',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'K',
    description: '',
    local: false,
    name: 'Bacon',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Pm',
    description: '',
    local: false,
    name: 'Philly Steak',
    tags: {
      meat: true,
    },
  },
  {
    availability: [],
    code: 'Ht',
    description: '',
    local: false,
    name: 'Hot Buffalo Sauce',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'F',
    description: '',
    local: true,
    name: 'Garlic',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'J',
    description: '',
    local: false,
    name: 'Jalapeno Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'O',
    description: '',
    local: false,
    name: 'Onions',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Z',
    description: '',
    local: false,
    name: 'Banana Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Td',
    description: '',
    local: false,
    name: 'Diced Tomatoes',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'R',
    description: '',
    local: false,
    name: 'Black Olives',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'M',
    description: '',
    local: false,
    name: 'Mushrooms',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'N',
    description: '',
    local: false,
    name: 'Pineapple',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Cp',
    description: '',
    local: false,
    name: 'Shredded Provolone Cheese',
    tags: {
      nonMeat: true,
      baseOptionQty: '1',
    },
  },
  {
    availability: [],
    code: 'E',
    description: '',
    local: false,
    name: 'Cheddar Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'G',
    description: '',
    local: false,
    name: 'Green Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Si',
    description: '',
    local: false,
    name: 'Spinach',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Rr',
    description: '',
    local: false,
    name: 'Roasted Red Peppers',
    tags: {
      vege: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Fe',
    description: '',
    local: false,
    name: 'Feta Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Cs',
    description: '',
    local: false,
    name: 'Shredded Parmesan Asiago',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Ac',
    description: '',
    local: false,
    name: 'American Cheese',
    tags: {
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Xf',
    description: '',
    local: false,
    name: 'Alfredo Sauce',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      exclusiveGroup: 'Sauce',
      sauce: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Rd',
    description: '',
    local: false,
    name: 'Ranch',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      sauce: true,
      nonMeat: true,
    },
  },
  {
    availability: [],
    code: 'Km',
    description: '',
    local: false,
    name: 'Ketchup-mustard sauce',
    tags: {
      wholeOnly: true,
      ignoreQty: true,
      exclusiveGroup: 'Sauce',
      sauce: true,
      nonMeat: true,
    },
  },
]
