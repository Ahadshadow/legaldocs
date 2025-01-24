export interface Reply {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  }
  
  export interface Comment {
    id: string;
    pageId: number;
    x: number;
    y: number;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt?: Date;
    replies: Reply[];
  }
  
  