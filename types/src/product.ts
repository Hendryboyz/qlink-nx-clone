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
  isVerified?: boolean;
}

export type ProductVO = ProductEntity & {
    img?: string;
}

export type ProductDto = Omit<ProductEntity, 'userId' | 'crmId' | 'isVerified' >

export type CreateProductRequest = Omit<ProductEntity, 'crmId' | 'isVerified' >

export type ProductUpdateDto =  {
    id: string;
    data: UpdateProductData;
}

export type UpdateProductData =
  Partial<Pick<ProductEntity,
    'year'|
    'vin' |
    'engineNumber' |
    'purchaseDate' |
    'registrationDate' |
    'dealerName' |
    'crmId' |
    'isVerified'
  >>;

export type ProductRemoveDto = {
    id: string
}
