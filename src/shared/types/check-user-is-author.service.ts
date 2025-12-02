export interface ICheckUserIsAuthor {
  checkUserIsAuthor(entityId: string, userId: string): Promise<boolean>;
}
