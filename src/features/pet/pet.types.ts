// ..\src\features\pet\types.ts

export type CreatePetPayload = {
  petName: string;
  species: string;
  breed: string;
  weight: number;
};

export type CreatePetResponse = {
  message: string;
  data: {
    id: string;
    petName: string;
    species: string;
    breed: string;
    weight: number;
    createdAt: string;
    updatedAt: string;
    customerId: string;
  };
};



export type Pet = {
  id: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
};

export type GetAllPetsResponse = {
  message: string;
  data: Pet[];
};

export type GetOnePetResponse = {
  message: string;
  data: Pet;
};


export type Pets = Pet[];