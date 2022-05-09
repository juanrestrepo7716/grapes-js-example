//::Bag::All
module Todo.NgLayer {
	export abstract class BaseEntity implements wy.BaseEntity {
		public Id: wy.PrimaryKey;
		public DeleteStatus?: number;
		public Name?: string;
	}
		export abstract class NamedEntity
			extends BaseEntity
		{
				public Name: string;
				public Notes: string;
		}
		export  class SocialComment
			extends BaseEntity
		{
				public SocialKey: string;
				public UserName: string;
				public Created: Date;
				public Text: string;
		}
		export  class SocialReaction
			extends BaseEntity
		{
				public SocialKey: string;
				public UserName: string;
				public Reaction: number;
		}
		export  class TodoItem
			extends NamedEntity
		{
				public Priority: number;
				public Pictures: string;
				public Pictures_Count: number;
				public Created: Date;
				public Finished: boolean;
				public OwnerId: number;
				public Owner: User;
				public ProjectId: number;
				public Project: Project;
				public Comments: string;
		}
		export  class Project
			extends NamedEntity
		{
				public Status: number;
				public CreatedBy: string;
				public Picture: string;
				public ProjectLocation: number;
				public TodoItems: TodoItem[];
				public Comments: string;
				public PdfDocument: string;
				public PdfDocument_Count: number;
				public ProjectFiles: string;
				public ProjectFiles_Count: number;
		}
		export  class User
			extends NamedEntity
		{
				public EmailAddress: string;
				public Picture: string;
				public Picture_Size: number;
				public Picture_PosX: number;
				public Picture_PosY: number;
				public Color: string;
				public Description: string;
				public Enabled: boolean;
				public Attachment: string;
				public Attachment_Size: number;
		}
		export  class Action
			extends TodoItem
		{
				public Contact: string;
		}
		export  class Message
			extends TodoItem
		{
				public MessageContents: string;
		}
		export enum Priority
		{
				High = 0,
				Low = 2,
				Medium = 1,
		}
		export enum Status
		{
				Closed = 2,
				New = 0,
				Open = 1,
		}
		export enum ProjectLocation
		{
				East = 3,
				North = 2,
				South = 1,
				West = 0,
		}
		export enum ReactionTypes
		{
				Dislike = 2,
				Like = 0,
				Love = 1,
		}
}
