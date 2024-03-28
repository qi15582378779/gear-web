import ps from "./index.module.scss";

const Empty: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={ps.empty}>
      <div>
        <img src="/images/other/empty.svg" alt="" />
        {text}
      </div>
    </div>
  );
};

export default Empty;
