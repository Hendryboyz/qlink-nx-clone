export enum CrmEntityType {
  VEHICLE = "vehicle",
  MEMBER = "member",
}

export enum CrmAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

export interface CrmPendingEntity {
  id: string;
  entityId: string;
  type: CrmEntityType;
  action: CrmAction;
  createdAt: Date;
  updatedAt: Date;
  isDone: boolean;
}
