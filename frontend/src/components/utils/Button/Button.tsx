import classNames from 'classnames';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant: 'primary' | 'secondary';
    children: React.ReactNode;
}

const Button = ({
    variant,
    loading = false,
    children,
    className,
    disabled,
    ...rest
}: ButtonProps) => {
    return (
        <button
            className={classNames('button-comp', variant, className, {
                disabled: loading || disabled
            })}
            disabled={loading || disabled}
            {...rest}
        >
            {loading ? 'Carregando...' : children}
        </button>
    );
};

export default Button;
