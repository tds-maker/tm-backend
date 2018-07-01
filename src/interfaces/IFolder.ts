export default interface IFolder {
    _id?: string;
    name: string;
    parentId?: string;
    folders?: IFolder[]    
  }
  