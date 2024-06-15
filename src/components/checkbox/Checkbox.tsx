import classNames from 'classnames';
import './Checkbox.scss';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { className, id, label, ...passthroughs } = props;
  return (
    <label htmlFor={id} className={classNames('checkbox', className)}>
      <input type='checkbox' id={id} tabIndex={0} {...passthroughs} />
      <span className='checkmark' />
      {label}
    </label>
  );
}
