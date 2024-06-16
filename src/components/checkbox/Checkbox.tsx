import QuestionMarkSVG from '@assets/question-mark.svg';
import classNames from 'classnames';
import './Checkbox.scss';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  isNSFW?: boolean;
}

export default function Checkbox(props: CheckboxProps) {
  const { className, id, label, icon, isNSFW, ...passthroughs } = props;
  return (
    <label htmlFor={id} className={classNames('checkbox', className)}>
      <input type='checkbox' id={id} tabIndex={0} {...passthroughs} />
      <span className='checkmark' />
      <img className='checkbox__icon' src={icon || QuestionMarkSVG} alt='' />
      <span className='checkbox__label'>
        {label}
        {isNSFW && <strong className='checkbox__nsfw'>18+</strong>}
      </span>
    </label>
  );
}
