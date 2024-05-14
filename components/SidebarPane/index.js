import s from './style.module.css';
import cn from 'classnames';

const SidebarPane = ({ title, icon, separateMoreFromContent, children }) => {
  return (
    <div
      className={cn(s.block, {
        [s.separateMoreFromContent]: separateMoreFromContent,
      })}
    >
      <div className={s.blockTitle}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
};

export default SidebarPane;
