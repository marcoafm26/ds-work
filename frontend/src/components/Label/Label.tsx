import './Label.scss';

interface LabelProps {
    id?: string;
    htmlFor: string;
    children: React.ReactNode;
}

const Label = ({ id, htmlFor, children }: LabelProps) => {
    return (
        <label className="label-comp" htmlFor={htmlFor} id={id}>
            {children}
        </label>
    );
};

export default Label;
