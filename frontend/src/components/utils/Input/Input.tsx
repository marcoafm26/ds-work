import { InputMask } from '@react-input/mask';
import classNames from 'classnames';
import './Input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    mask?: 'cpf' | 'phone';
    placeholder?: 'cash' | 'cpf' | 'phone';
}

const maskConfig = {
    cpf: {
        mask: '___.___.___-__',
        replacement: { _: /[0-9]/ }
    },
    phone: {
        mask: '(99) 99999-9999',
        replacement: '9'
    }
};

const Input = ({ mask, className, ...rest }: InputProps) => {
    if (mask) {
        return (
            <InputMask
                {...rest}
                mask={maskConfig[mask].mask}
                replacement={maskConfig[mask].replacement}
                className={classNames('input-comp', className)}
            />
        );
    }

    return <input {...rest} className={classNames('input-comp', className)} />;
};

Input.displayName = 'Input';

export default Input;
