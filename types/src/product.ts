export type ProductEntity = {
  id: string;  // Vehicle Registration ID
  userId: string;
  vin: string;
  engineNumber: string;
  purchaseDate: string;
  registrationDate: string;
  dealerName: string;
  year: number;
  model: string; // mapping to DB
  crmId?: string;
}

export type ProductVO = ProductEntity & {
    img?: string;
}

export type ProductDto = Omit<ProductEntity, 'user_id' >

export type ProductUpdateDto =  {
    id: string,
    data: Partial<Pick<ProductEntity, 'year' | 'vin' | 'engineNumber' | 'purchaseDate' | 'registrationDate' | 'dealerName'>>
}

export type ProductRemoveDto = {
    id: string
}
