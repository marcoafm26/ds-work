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
    return (
        <InputMask
            {...rest}
            mask={mask ? maskConfig[mask].mask : undefined}
            replacement={mask ? maskConfig[mask].replacement : undefined}
            className={classNames('input-comp', className)}
        />
    );
};

Input.displayName = 'Input';

export default Input;
