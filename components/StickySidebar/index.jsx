import s from './style.module.css';

const StickySidebar = ({ children, sidebar, width = 300 }) => (
  <div className={s.split}>
    <div className={s.content}>{children}</div>
    <div className={s.sidebar} style={{ width: `${width}px` }}>
      <div className={s.sidebarInner}>{sidebar}</div>
    </div>
  </div>
);

export default StickySidebar;
