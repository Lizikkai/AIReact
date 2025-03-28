import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <Result
        status="404"
        title="404"
        subTitle="抱歉,该页面未找到"
        extra={
          <Button onClick={handleBack} type="primary">
            返回主页
          </Button>
        }
      ></Result>
    </div>
  );

  function handleBack() {
    navigate(-1);
  }
};
export default PageNotFound;
