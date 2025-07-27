import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives';
import { ProductEntity, UserEntity } from '@org/types';
import { UserSourceDisplay } from '@org/common';

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

  public async syncMember(clientUser: UserEntity): Promise<string | undefined> {
    const payload = this.castSalesforceMemberPayload(clientUser);
    let response = await this.postMember(payload);
    if (response.status === 401) {
      await this.authSalesforce();
      response = await this.postMember(payload);
    }
    const {data, status} = response;
    if (status > 299) {
      this.logger.error(`fail to sync user to salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
      return undefined;
    } else {
      this.logger.debug(`sync user to salesforce successfully, status code: ${status}, message: ${JSON.stringify(data)}`);
      return data.id;
    }
  }

  private castSalesforceMemberPayload(user: UserEntity) {
    return {
      "Member_Profile_External_ID__c": user.id,
      "Member_ID__c": user.memberId,
      "First_Name__c": user.firstName,
      "Middle_Name__c": user.midName,
      "Last_Name__c": user.lastName,
      "Birthdate__c": "1999-01-01",
      "Gender__c": user.gender,
      "Email__c": user.email,
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
      let response = await action(payload);
      if (response.status === 401) {
        await this.authSalesforce();
        response = await action(payload);
      }
      return response;
    }
  }

  public async syncVehicle(vehicleEntity: ProductEntity): Promise<VehicleSyncResult> {
    const payload = this.castSalesforceVehiclePayload(vehicleEntity);
    const syncAction = this.useReAuthQuery(this.postVehicle.bind(this));
    const response = await syncAction(payload);
    const {data, status} = response;
    if (status > 299) {
      this.logger.warn(`fail to sync vehicle to salesforce successfully, status code: ${status}, message: ${data}`);
      return {
        vehicleId: undefined,
        isVerified: false,
      }
    } else {
      this.logger.debug(`sync vehicle to salesforce successfully, status code: ${status}, message: ${data}`);
      return {
        vehicleId: data.id,
        isVerified: await this.verifyRegistration(data.id),
      }
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
      "Vehicle_Reg_Data_External_ID__c": null,
      "Vehicle_Registration_ID__c": vehicle.id,
      "Model__r": {
        "Model_EID__c": vehicle.model
      },
      "Year__c": vehicle.year,
      "VIN_Number__r": {
        "VIN_Number_EID__c": vehicle.vin,
      },
      "VIN_Number_Check__c": vehicle.vin,
      "Engine_Serial_Number__r": {
        "Engine_Serial_Number_EID__c": vehicle.engineNumber,
      },
      "Engine_Serial_Number_Check__c": vehicle.engineNumber,
      "Vehicle_Condition__c": "New",
      "Purchase_Date__c": vehicle.purchaseDate,
      "Registration_Date__c": vehicle.registrationDate,
      "Member_ID__r": {
        "Member_Profile_External_ID__c": vehicle.userId
      },
      "Dealer_Name__r": {
        "Name": vehicle.dealerName,
      },
      "Dealer_Name_Check__c": vehicle.dealerName,
    }
  }

  private async verifyRegistration(salesforceVehicleId: string): Promise<boolean> {
    const syncAction = this.useReAuthQuery(this.getVehicle.bind(this));
    const response = await syncAction(salesforceVehicleId);

    const {data, status} = response;
    if (status > 299) {
      this.logger.warn(`fail to get vehicle object, status code: ${status}, message: ${data}`);
      return false;
    } else {
      this.logger.debug(`get vehicle successfully, status code: ${status}, message: ${data}`);
      const { Engine_Serial_Number__c, VIN_Number__c, Model__c } = response.data;
      return Engine_Serial_Number__c && VIN_Number__c && Model__c;
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
}
