import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "./ErrorWithOllie.css";
import { MdFilterListOff } from "react-icons/md";
import oliImage from "../../assets/oli.png";

export default function ErrorWithOllie({
  title,
  clearFilter,
  clearFilterAction,
  children,
  redirectToHome,
  loading,
  loadingTitle,
  loadingProgress,
  hideOllie,
  customeButtonTitle,
  cuttomeButtonAction,
}) {

  const redirect = (link) => {
    window.location.href = link;
  };

  return (
    <div className="not-found">
      {!hideOllie && (
        <img src={oliImage} className="ollie" />
      )}
      {title && (
        <h1>{title}</h1>
      )}
      {children && (
        <p>{children}</p>
      )}
      {loading && (
        <div className="checking-info">
          <AiOutlineLoading3Quarters /> {loadingTitle || "Loading"} {loadingProgress && <span>{loadingProgress}</span>}
        </div>
      )}
      {clearFilter && (
        <button onClick={clearFilterAction}>
          <MdFilterListOff /> Clear Filters
        </button>
      )}
      {redirectToHome && (
        <button onClick={() => redirect("/")}>
          Back to home
        </button>
      )}
      {(customeButtonTitle && cuttomeButtonAction) &&(
        <button onClick={cuttomeButtonAction}>
          {customeButtonTitle}
        </button>
      )}
    </div>
  );
}
