//::Bag::Components
import { NgModule } from '@angular/core';
import { WyBaseModule } from './wy-base.module';
        import { WyGridComponent_DefaultGrid_TodoItem } from '../components/wy-grid/wy-component-defaultgrid_todoitem.component';
        import { WyGridComponent_DefaultGrid_Project } from '../components/wy-grid/wy-component-defaultgrid_project.component';
        import { WyGridComponent_DefaultGrid_User } from '../components/wy-grid/wy-component-defaultgrid_user.component';
        import { WyGridComponent_DefaultGrid_Action } from '../components/wy-grid/wy-component-defaultgrid_action.component';
        import { WyGridComponent_DefaultGrid_Message } from '../components/wy-grid/wy-component-defaultgrid_message.component';
        import { WyGridComponent_DefaultGrid_SocialComment } from '../components/wy-grid/wy-component-defaultgrid_socialcomment.component';
        import { WyGridComponent_DefaultGrid_SocialReaction } from '../components/wy-grid/wy-component-defaultgrid_socialreaction.component';
        import { WyOneEntityComponent_DefaultOneEntity_TodoItem } from '../components/wy-one-entity/wy-component-defaultoneentity_todoitem.component';
        import { WyOneEntityComponent_DefaultOneEntity_Project } from '../components/wy-one-entity/wy-component-defaultoneentity_project.component';
        import { WyOneEntityComponent_DefaultOneEntity_User } from '../components/wy-one-entity/wy-component-defaultoneentity_user.component';
        import { WyOneEntityComponent_DefaultOneEntity_Action } from '../components/wy-one-entity/wy-component-defaultoneentity_action.component';
        import { WyOneEntityComponent_DefaultOneEntity_Message } from '../components/wy-one-entity/wy-component-defaultoneentity_message.component';
        import { WyOneEntityComponent_DefaultOneEntity_SocialComment } from '../components/wy-one-entity/wy-component-defaultoneentity_socialcomment.component';
        import { WyOneEntityComponent_DefaultOneEntity_SocialReaction } from '../components/wy-one-entity/wy-component-defaultoneentity_socialreaction.component';
        import { WySocialComponent_DefaultSocial_Project } from '../components/wy-social/wy-component-defaultsocial_project.component';
        import { WyCustomComponent_AttachmentStuff } from '../components/wy-custom/wy-component-attachmentstuff.component';
@NgModule({
    imports: [
        WyBaseModule,
    ],
    declarations: [
                WyGridComponent_DefaultGrid_TodoItem,
                WyGridComponent_DefaultGrid_Project,
                WyGridComponent_DefaultGrid_User,
                WyGridComponent_DefaultGrid_Action,
                WyGridComponent_DefaultGrid_Message,
                WyGridComponent_DefaultGrid_SocialComment,
                WyGridComponent_DefaultGrid_SocialReaction,
                WyOneEntityComponent_DefaultOneEntity_TodoItem,
                WyOneEntityComponent_DefaultOneEntity_Project,
                WyOneEntityComponent_DefaultOneEntity_User,
                WyOneEntityComponent_DefaultOneEntity_Action,
                WyOneEntityComponent_DefaultOneEntity_Message,
                WyOneEntityComponent_DefaultOneEntity_SocialComment,
                WyOneEntityComponent_DefaultOneEntity_SocialReaction,
                WySocialComponent_DefaultSocial_Project,
                WyCustomComponent_AttachmentStuff,
    ],
    exports: [
                WyGridComponent_DefaultGrid_TodoItem,
                WyGridComponent_DefaultGrid_Project,
                WyGridComponent_DefaultGrid_User,
                WyGridComponent_DefaultGrid_Action,
                WyGridComponent_DefaultGrid_Message,
                WyGridComponent_DefaultGrid_SocialComment,
                WyGridComponent_DefaultGrid_SocialReaction,
                WyOneEntityComponent_DefaultOneEntity_TodoItem,
                WyOneEntityComponent_DefaultOneEntity_Project,
                WyOneEntityComponent_DefaultOneEntity_User,
                WyOneEntityComponent_DefaultOneEntity_Action,
                WyOneEntityComponent_DefaultOneEntity_Message,
                WyOneEntityComponent_DefaultOneEntity_SocialComment,
                WyOneEntityComponent_DefaultOneEntity_SocialReaction,
                WySocialComponent_DefaultSocial_Project,
                WyCustomComponent_AttachmentStuff,
        WyBaseModule,
    ]
})
export class WyDefaultModule { }
