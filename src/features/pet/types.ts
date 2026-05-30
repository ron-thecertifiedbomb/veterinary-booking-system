export type Pet = {
  id: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
};

export type CreatePetPayload = {
  petName: string;
  species: string;
  breed: string;
  weight: number;
};


export type CreatePetResponse = {
  message: string;
  data: Pet;
};