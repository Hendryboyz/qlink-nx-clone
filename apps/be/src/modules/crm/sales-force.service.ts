import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives';
import { ProductEntity, UserEntity } from '@org/types';
import { UserSourceDisplay, DEFAULT_MODELS } from '@org/common';

type SalesForceCredentials = {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
};

type SalesForceAPIResource = {
  instanceUrl: string;
  accessToken: string;
}

type SalesForceErrorMessage = {
  message: string;
  errorCode: string;
  fields: string[];
}

type VehicleSyncResult = {
  vehicleId: string | null;
  isVerified: boolean;
};

type ActionFunctionType = (payload: any | undefined) => Promise<AxiosResponse>

@Injectable()
export class SalesforceSyncService implements OnModuleInit{
  private readonly logger = new Logger(this.constructor.name);

  private readonly authUrl: string;
  private credential: SalesForceCredentials;

  private apiResource: SalesForceAPIResource;

  constructor(private configService: ConfigService) {
    this.credential = {
      clientId: this.configService.get<string>('SALESFORCE_CLIENT_ID'),
      clientSecret: this.configService.get<string>('SALESFORCE_CLIENT_SECRET'),
      username: this.configService.get<string>('SALESFORCE_USERNAME'),
      password: this.configService.get<string>('SALESFORCE_PASSWORD'),
    };
    this.authUrl = this.configService.get<string>('SALESFORCE_AUTH_URL');
  }

  async onModuleInit(): Promise<void> {
    await this.authSalesforce();
  }

  private async authSalesforce() {
    const authParams = new URLSearchParams();
    authParams.set('grant_type', 'password')
    authParams.set('client_id', this.credential.clientId);
    authParams.set('client_secret', this.credential.clientSecret);
    authParams.set('username', this.credential.username);
    authParams.set('password', this.credential.password);
    const fullAuthRequest = `${this.authUrl}?${authParams.toString()}`;
    const resp = await axios.post(fullAuthRequest);
    const { data } = resp;
    this.apiResource = {
      instanceUrl: data['instance_url'],
      accessToken: data['access_token'],
    }
    this.logger.debug(this.apiResource);
  }

  public async createMember(clientUser: UserEntity): Promise<string | undefined> {
    try {
      const payload = this.castSalesforceMemberCreationPayload(clientUser);
      const syncAction = this.useReAuthQuery(this.postMember.bind(this));
      const response = await syncAction(payload);
      const {data, status} = response;
      this.logger.debug(`sync user to salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
      return data.id;
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `fail to sync user to salesforce, status code: ${response.status}, message:`, response.data);
      } else {
        this.logger.error('fail to sync user to salesforce, status code: 500', error)
      }
      throw error;
    }
  }

  private castSalesforceMemberCreationPayload(user: UserEntity) {
    return {
      "Member_Profile_External_ID__c": user.id,
      "Name": user.memberId,
      "Member_ID__c": user.memberId,
      "First_Name__c": user.firstName,
      "Middle_Name__c": user.midName,
      "Last_Name__c": user.lastName,
      "Birthdate__c": user.birthday,
      "Gender__c": user.gender,
      "Email__c": user.email,
      "Mobile__c": user.phone,
      "State__c": user.addressState,
      "City__c": user.addressCity,
      "WhatsApp_ID__c": user.whatsapp,
      "Facebook_ID__c": user.facebook,
      "Registration_Date__c": user.createdAt,
      "Registration_Source__c": UserSourceDisplay[user.source],
    }

  }

  private postMember(payload: any): Promise<AxiosResponse> {
    const createMemberUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Member_Profile__c`;
    return axios.post(createMemberUrl, payload, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }

  private useReAuthQuery(action: ActionFunctionType) {
    return async (payload: any | undefined) => {
      try {
        return await action(payload);
      } catch (e) {
        if (e.status && e.status === 401) {
          await this.authSalesforce();
          return await action(payload);
        }
        throw e;
      }
    }
  }

  public async updateMember(updatedUser: UserEntity): Promise<string | undefined> {
    try {
      const payload = this.castSalesforceMemberMutationPayload(updatedUser);
      const salesforceObjectId = updatedUser.crmId;
      const syncAction = this.useReAuthQuery(this.patchMember.bind(this));
      const response = await syncAction({
        memberObjectId: salesforceObjectId,
        payload,
      });
      const {data, status} = response;
      this.logger.debug(`patch user to salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
      return salesforceObjectId;
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `fail to patch user to salesforce, status code: ${response.status}, message:`, response.data);
      } else {
        this.logger.error('fail to patch user to salesforce, status code: 500', error)
      }
      throw error;
    }

  }

  private castSalesforceMemberMutationPayload(user: UserEntity) {
    return {
      "First_Name__c": user.firstName,
      "Middle_Name__c": user.midName,
      "Last_Name__c": user.lastName,
      "Birthdate__c": user.birthday,
      "Gender__c": user.gender,
      "Mobile__c": user.phone,
      "Email__c": user.email,
      "State__c": user.addressState,
      "City__c": user.addressCity,
      "WhatsApp_ID__c": user.whatsapp,
      "Facebook_ID__c": user.facebook,
      "Registration_Source__c": UserSourceDisplay[user.source],
    }
  }

  private patchMember(request: {
    memberObjectId: string,
    payload: any,
  }): Promise<AxiosResponse> {
    const {memberObjectId, payload} = request;
    const patchMemberUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Member_Profile__c/${memberObjectId}`;
    return axios.patch(patchMemberUrl, payload, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }

  public async deleteMember(salesforceId: string): Promise<void> {
    try {
      const syncAction = this.useReAuthQuery(this.requestMemberDeletion.bind(this));
      const response = await syncAction({
        memberObjectId: salesforceId,
      });
      const {data, status} = response;
      this.logger.debug(`remove member from salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `fail to delete member from salesforce, status code: ${response.status}, message:`, response.data);
      } else {
        this.logger.error('fail to delete member from salesforce, status code: 500', error)
      }
      throw error;
    }
  }

  private requestMemberDeletion(request: {
    memberObjectId: string,
  }): Promise<AxiosResponse> {
    const {memberObjectId} = request;
    const deleteMemberUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Member_Profile__c/${memberObjectId}`;
    return axios.delete(deleteMemberUrl, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      },
    });
  }

  public async syncVehicle(vehicleEntity: ProductEntity): Promise<VehicleSyncResult> {
    try {
      const payload = this.castSalesforceVehiclePayload(vehicleEntity);
      const syncAction = this.useReAuthQuery(this.postVehicle.bind(this));
      const response = await syncAction(payload);
      const {data, status} = response;
      this.logger.debug(`sync vehicle to salesforce successfully, status code: ${status}, message: ${data}`);
      return {
        vehicleId: data.id,
        isVerified: false,
      }
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `fail to sync vehicle to salesforce, status code: ${response.status}, message:`, JSON.stringify(response.data));
      } else {
        this.logger.error('fail to sync vehicle to salesforce, status code: 500', error)
      }
      throw error;
    }
  }

  private async postVehicle(payload: any) {
    const createVehicleUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Vehicle_Registration_Data__c`;
    return axios.post(createVehicleUrl, payload, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }

  private castSalesforceVehiclePayload(vehicle: ProductEntity) {
    return {
      "Name": vehicle.id,
      "Vehicle_Reg_Data_External_ID__c": null,
      "Vehicle_Registration_ID__c": vehicle.id,
      "Model__r": {
        "Model_EID__c": this.convertToModelTitle(vehicle.model),
      },
      "Year__c": vehicle.year,
      "VIN_Number_Check__c": vehicle.vin,
      "Engine_Serial_Number_Check__c": vehicle.engineNumber,
      "Vehicle_Condition__c": "New",
      "Purchase_Date__c": vehicle.purchaseDate,
      "Registration_Date__c": vehicle.registrationDate,
      "Member_ID__r": {
        "Member_Profile_External_ID__c": vehicle.userId
      },
      "Dealer_Name_Check__c": vehicle.dealerName,
    }
  }

  private convertToModelTitle(modelId: string): string {
    return DEFAULT_MODELS.find(m => m.id.toString() === modelId).title
  }

  public async updateVehicle(vehicleEntity: ProductEntity): Promise<null | SalesForceErrorMessage> {
    try {
      const payload = this.castPatchVehiclePayload(vehicleEntity);
      const syncAction = this.useReAuthQuery(this.patchVehicle.bind(this));
      const response = await syncAction({vehicleObjectId: vehicleEntity.crmId, payload});
      const {data, status} = response;
      this.logger.debug(`patch vehicle to salesforce successfully, status code: ${status}, message: ${data}`);
      return null;
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        if (!response.data || response.data.length === 0) {
          return {
            message: '',
            errorCode: '',
            fields: [],
          }
        }

        const errorContent = response.data[0]
        const patchErrorDetail = {
          message: errorContent['message'],
          errorCode: errorContent['errorCode'],
          fields: errorContent['fields'],
        }

        this.logger.error(`fail to patch vehicle to salesforce, status code: ${response.status}, message: ${patchErrorDetail}`);
        return patchErrorDetail;
      } else {
        this.logger.error('fail to patch vehicle to salesforce, status code: 500', error)
        return {
          message: '',
          errorCode: '',
          fields: [],
        }
      }
    }
  }

  private castPatchVehiclePayload(vehicle: ProductEntity) {
    return {
      "Model__r": {
        "Model_EID__c": this.convertToModelTitle(vehicle.model),
      },
      "Year__c": vehicle.year,
      "Purchase_Date__c": vehicle.purchaseDate,
      "Registration_Date__c": vehicle.registrationDate,
      "VIN_Number_Check__c": vehicle.vin,
      "Engine_Serial_Number_Check__c": vehicle.engineNumber,
      "Dealer_Name_Check__c": vehicle.dealerName,
    }
  }

  public async verifyVehicle(vehicleEntity: ProductEntity): Promise<boolean> {
    if (vehicleEntity.isVerified === true) {
      return true
    }
    return this.isVehicleValid(vehicleEntity.crmId);
  }

  private async verifyVehicleField(vehicleId: string, fieldName: string, value: string): Promise<boolean> {
    if (!fieldName || !value) {
      return false;
    }
    try {
      const payload = this.castPatchVerifyVehicleFieldPayload(fieldName, value);
      const syncAction = this.useReAuthQuery(this.patchVehicle.bind(this));
      const response = await syncAction({vehicleObjectId: vehicleId, payload});
      const {data, status} = response;
      this.logger.debug(`valid vehicle ${fieldName} successfully, status code: ${status}, message: ${data}`);
      return true
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(`verify vehicle ${fieldName} field failed, status code ${response.status}, message `, response.data);
      } else {
        this.logger.error(`verify vehicle ${fieldName} field failed, status code 500, message `, error);
      }
      return false;
    }
  }

  private castPatchVerifyVehicleFieldPayload(fieldName: string, value: string) {
    if (fieldName === 'Dealer_Name') {
      return {
        Dealer_Name__r: {
          Name: value
        },
        Dealer_Name_Check__c: value,
      };
    }
    return {
      [`${fieldName}__r`]: {
        [`${fieldName}_EID__c`]: value
      },
      [`${fieldName}_Check__c`]: value,
    }
  }

  private async patchVehicle(data: {vehicleObjectId: string, payload: any}) {
    const {vehicleObjectId, payload} = data;
    const patchVehicleUrl =
      `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Vehicle_Registration_Data__c/${vehicleObjectId}`;
    return axios.patch(patchVehicleUrl, payload, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }

  private async isVehicleValid(vehicleObjectId: string): Promise<boolean> {
    try {
      const syncAction = this.useReAuthQuery(this.getVehicle.bind(this));
      const response = await syncAction(vehicleObjectId);
      const {data, status} = response;
      const { Verification_Status__c } = data;
      this.logger.debug(`try to valid vehicle successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
      return Verification_Status__c === 'Verified';
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(`verify vehicle failed, status code ${response.status}, message `, response.data);
      } else {
        this.logger.error(`verify vehicle failed, status code 500, message `, error);
      }
      return false;
    }
  }

  private async getVehicle(vehicleId: string): Promise<AxiosResponse> {
    const getVehicleUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Vehicle_Registration_Data__c/${vehicleId}`;
    return axios.get(getVehicleUrl, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }

  public async deleteVehicle(salesforceId: string): Promise<void> {
    try {
      const syncAction = this.useReAuthQuery(this.requestVehicleDeletion.bind(this));
      const response = await syncAction({
        vehicleObjectId: salesforceId,
      });
      const {data, status} = response;
      this.logger.debug(`remove vehicle from salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `fail to delete vehicle from salesforce, status code: ${response.status}, message:`, response.data);
      } else {
        this.logger.error('fail to delete vehicle from salesforce, status code: 500', error)
      }
      throw error;
    }
  }

  private async requestVehicleDeletion(request: {
    vehicleObjectId: string,
  }): Promise<AxiosResponse> {
    const {vehicleObjectId} = request;
    const deleteVehicleUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects/Vehicle_Registration_Data__c/${vehicleObjectId}`;
    return axios.delete(deleteVehicleUrl, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      },
    })
  }

   public async isAlive(): Promise<boolean> {
    if (!this.apiResource.instanceUrl) {
      return false;
    }

    try {
      const syncAction = this.useReAuthQuery(this.healthCheck.bind(this));
      const response = await syncAction(undefined);
      return response.status === 200;
    } catch (error) {
      if (error.response)  {
        const { response } = error;
        this.logger.error(
          `salesforce is unhealthy, status code: ${response.status}, message:`, response.data);
      } else {
        this.logger.error('salesforce is unhealthy, status code: 500', error)
      }
      return false;
    }

  }

  private healthCheck(): Promise<AxiosResponse> {
    const healthCheckUrl = `${this.apiResource.instanceUrl}/services/data/v49.0/sobjects`;
    return axios.get(healthCheckUrl, {
      headers: {
        'Authorization': `Bearer ${this.apiResource.accessToken}`,
      }
    });
  }
}
