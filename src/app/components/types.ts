import { FormGroup } from '@angular/forms';

/**
 * DynamicObjectExpressionApi, used by DisplayExpression, ComputeExpression.
 */
export class DynamicObjectExpressionApi {
    constructor(currentEntity: FormGroup, ownerEntity: FormGroup, className: string, ownerClassName: string, private _usrSet: wy.IUserSettingsService) {
        this.currentEntity = new DynamicObjectExpressionEntityApi(currentEntity, className);
        this.ownerEntity = new DynamicObjectExpressionEntityApi(ownerEntity, ownerClassName);

        this.math = new DynamicObjectExpressionMathApi();
    }

    public currentEntity: DynamicObjectExpressionEntityApi;
    public ownerEntity: DynamicObjectExpressionEntityApi;

    public math: DynamicObjectExpressionMathApi;

    /**
     * Returns current datetime.
     */
    public getCurrentDateTime(): Date {
        return new Date();
    }

    /**
     * Converts any value to a string.
     * @param value Value.
     */
    public convertToString(value: any): string {
        if (value) {
            return value.toString();
        }

        return "";
    }

    /**
     * Converts any value to a string.
     * @param value Value.
     */
    public convertToInt(value: any): number {
        if (value) {
            return parseInt(value);
        }

        return 0;
    }

    /**
     * Retrieve a user setting by key.
     * @param key Key.
     */
    public getUserSetting(key: string): any {
        return this._usrSet.getUserSetting(key);
    }
}

export class DynamicObjectExpressionMathApi {    
    public roundDouble(value: number, decimals: number)
    {
        return Number(Math.round((value + 'e' + decimals) as any) + 'e-' + decimals);
    }

    public roundFloat(value: number, decimals: number)
    {
        return this.roundDouble(value, decimals);
    }
}

export class DynamicObjectExpressionEntityApi {
    constructor(private _obj: FormGroup, private _className: string) {
    }

    /**
     * Get value by property name.
     * @param propertyName 
     */
    public getPropertyValue(propertyName: string) {
        return this._obj?.get(propertyName)?.value;
    }

    public getPropertyValueAsString(propertyName: string) {
        return this.getPropertyValue(propertyName);
    }

    public getPropertyValueAsFloat(propertyName: string) {
        return this.getPropertyValue(propertyName);
    }

    public getPropertyValueAsInt(propertyName: string) {
        return this.getPropertyValue(propertyName);
    }

    public getPropertyValueAsDouble(propertyName: string) {
        return this.getPropertyValue(propertyName);
    }

    public getPropertyValueAsBoolean(propertyName: string) {
        return this.getPropertyValue(propertyName);
    }

    /**
     * Check value by property name.
     * @param propertyName 
     */
    public hasPropertyValue(propertyName: string) {
        const value = this.getPropertyValue(propertyName);
        return !!value;
    }

    /**
     * Get class name.
     */
    public getClassName(): string {
        return this._className;
    }
}
