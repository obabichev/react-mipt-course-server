import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import {boardModel} from './board.model';

@ValidatorConstraint({name: "uniqueBoardKey", async: false})
export class UniqueBoardKeyValidation implements ValidatorConstraintInterface {

    validate(text: string, args: ValidationArguments) {
        return (async () => {
            if (typeof (args.value) !== 'string') {
                return true;
            }

            const boardByKey = await boardModel.findOne({key: args.value.toUpperCase()});

            return !boardByKey;
        })();
    }

    defaultMessage({value}: ValidationArguments) {
        return `Board with the key ${value.toUpperCase()} already exists`;
    }

}