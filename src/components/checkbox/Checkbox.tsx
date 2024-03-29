import './Checkbox.scss';
import classNames from 'classnames';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onClick: () => void;
}

export default function Checkbox(props: CheckboxProps) {
  const { className, id, name, value, label, checked, onClick } = props;
  return (
    <label htmlFor={id} className={classNames('checkbox', className)}>
      <input
        onClick={onClick}
        type='checkbox'
        id={id}
        name={name}
        value={value}
        tabIndex={0}
        checked={checked}
      />
      <span className='checkmark' />
      {label}
    </label>
  );
}
