/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

/* Load json (kendo internationalization) */
declare module "*.json" {
    const value: any;
    export default value;
}
