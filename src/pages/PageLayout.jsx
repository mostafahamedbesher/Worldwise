import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import styles from "../pages/PageLayout.module.css";
import User from "../components/User";

function PageLayout() {
  return (
    <section className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </section>
  );
}

export default PageLayout;
