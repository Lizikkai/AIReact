import clsx from "clsx";
import styles from './index.module.css'
import Main from "../Main";
import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <main className={ clsx('box-border min-h-screen', styles.mainContainer) }>
      <div className={clsx(styles.mainHeader, 'w-full')}>
        <div className="pt-1 w-full">
          <div className={styles.mainHeaderWrap}>
            <div className={clsx(styles.mainHeaderWrapLeft, 'flex items-center')}>
              <img src="https://gw.alicdn.com/imgextra/i1/O1CN0119EgaC1yoIi6UVLTQ_!!6000000006625-55-tps-80-32.svg" className="w-65px" alt="" />
              <div className={styles.mainHeaderWrapLeftMenu}>
                <Link to="/conversation" className={styles.mainHeaderWrapLeftMenuLink}>
                  <div>会话</div>
                </Link>
                {/* <Link></Link> */}
              </div>
            </div>
            <div className={styles.mainHeaderWrapRight}></div>
          </div>
        </div>
      </div>
      <Main></Main>
    </main>
  )
}