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

export type PetProfile = Pet & {
  appointmentIDs?: string[];
};

export type GetAllPetsResponse = {
  message: string;
  data: Pet[];
};

export type GetOnePetResponse = {
  message: string;
  data: PetProfile;
};

export type UpdatePetPayload = {
  petName?: string;
  species?: string;
  breed?: string;
  weight?: number;
};

export type UpdatePetResponse = {
  message: string;
  data: Pet;
};

export type Pets = Pet[];