import './Checkbox.scss';
import classNames from 'classnames';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  value: string;
  label: string;
}

export function Checkbox(props: CheckboxProps) {
  const { className, id, name, value, label } = props;
  return (
    <label htmlFor={id} className={classNames('checkbox', className)}>
      <input type='checkbox' id={id} name={name} value={value} tabIndex={0} />
      <span className='checkmark' />
      {label}
    </label>
  );
}
